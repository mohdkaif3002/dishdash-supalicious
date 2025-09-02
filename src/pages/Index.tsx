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

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="secondary" className="px-4 py-2 bg-card border border-border shadow-sm">
                <Clock className="w-4 h-4 mr-2" />
                30 min delivery
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-card border border-border shadow-sm">
                <Star className="w-4 h-4 mr-2" />
                Top rated restaurants
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-card border border-border shadow-sm">
                <Utensils className="w-4 h-4 mr-2" />
                Fresh ingredients
              </Badge>
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
            <Button variant="outline">View All</Button>
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
              <p className="text-muted-foreground">
                Be the first restaurant owner to join CraveCart!
              </p>
              {user?.user_metadata?.user_role === 'restaurant_owner' && (
                <Button className="mt-4">Add Your Restaurant</Button>
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Sign Up Now
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                Become a Partner
              </Button>
            </div>
          ) : (
            <Button size="lg" variant="secondary">
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
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
                  <svg className="h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm-1 8h2v6h-2v-6zm0-4h2v2h-2V6z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-xl font-extrabold text-primary">Crave</span>
                  <span className="text-xl font-light text-foreground">Cart</span>
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
