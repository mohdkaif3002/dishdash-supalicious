import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/Navigation';
import { RestaurantCard } from '@/components/RestaurantCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Search, Utensils, Clock, Star } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Error fetching restaurants:', error);
      } else {
        setRestaurants(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Your Next Meal,{' '}
              <span className="text-primary">Faster</span> and{' '}
              <span className="text-primary">Fresher</span>
            </h1>
            <p className="text-lg md:text-xl text-primary font-medium mb-6">
              From Craving to Doorstep
            </p>
            <p className="text-lg text-secondary-text mb-8">
              Discover amazing restaurants and get your favorite food delivered in minutes
            </p>
            
            <div className="flex items-center max-w-md mx-auto mb-8">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-text h-5 w-5" />
                <div className="pl-10 pr-4 py-3 border border-border rounded-l-lg bg-background shadow-sm">
                  <span className="text-sm text-secondary-text">Delhi, India</span>
                </div>
              </div>
              <Button className="rounded-l-none px-8 py-3 h-auto">
                Find Food
              </Button>
            </div>

             <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
              <Button size="lg" className="text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl">
                Order Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 font-medium border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-md hover:shadow-lg">
                Browse Restaurants
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Cuisines</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Indian', emoji: '🍛' },
              { name: 'Italian', emoji: '🍝' },
              { name: 'Chinese', emoji: '🥢' },
              { name: 'Mexican', emoji: '🌮' },
              { name: 'Thai', emoji: '🍜' },
              { name: 'Japanese', emoji: '🍱' },
            ].map((cuisine) => (
              <Card key={cuisine.name} className="cursor-pointer bg-card border border-border rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">{cuisine.emoji}</div>
                  <h3 className="font-semibold text-card-foreground">{cuisine.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Top Rated Restaurants</h2>
            <Button variant="outline" className="px-6">View All</Button>
          </div>

          {loadingRestaurants ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : restaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => console.log('Navigate to restaurant', restaurant.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
              <p className="text-muted-foreground mb-6">
                Be the first restaurant owner to join CraveCart!
              </p>
              {user?.user_metadata?.user_role === 'restaurant_owner' && (
                <Button className="px-6 py-3">Add Your Restaurant</Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to satisfy your cravings?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join thousands of food lovers who trust CraveCart for their daily meals
          </p>
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button size="lg" variant="secondary" className="px-8 py-4 font-semibold">
                Sign Up Now
              </Button>
              <Button size="lg" variant="outline" className="text-white border-2 border-white hover:bg-white hover:text-primary font-medium px-8 py-4">
                Become a Partner
              </Button>
            </div>
          ) : (
            <Button size="lg" variant="secondary" className="px-8 py-4 font-semibold">
              <Search className="mr-2 h-5 w-5" />
              Start Ordering
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/lovable-uploads/388f2e98-a0c8-4dd6-8225-c328141f2c57.png" 
                  alt="CraveCart Logo" 
                  className="h-8 w-8 object-contain"
                />
                <div>
                  <span className="text-xl font-bold text-primary">CraveCart</span>
                </div>
              </div>
              <p className="text-secondary-text">
                From Craving to Doorstep
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Partners</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Restaurant Partner</a></li>
                <li><a href="#" className="hover:text-foreground">Delivery Partner</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CraveCart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
