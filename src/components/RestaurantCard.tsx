import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    description?: string;
    banner_url?: string;
    cuisine_types: string[];
    rating: number;
    total_reviews: number;
    avg_cost_for_two?: number;
    address: string;
  };
  estimatedDelivery?: string;
  onClick?: () => void;
}

export function RestaurantCard({ restaurant, estimatedDelivery = "25-30 mins", onClick }: RestaurantCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      onClick={onClick}
    >
      <div className="relative">
        <div className="h-48 bg-muted overflow-hidden">
          {restaurant.banner_url ? (
            <img
              src={restaurant.banner_url}
              alt={restaurant.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span className="text-lg font-medium">{restaurant.name}</span>
            </div>
          )}
        </div>
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            ⚡ Fast Delivery
          </Badge>
        </div>
        
        {restaurant.avg_cost_for_two && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-white">
              ₹{Math.floor(restaurant.avg_cost_for_two / 100)} for two
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg truncate">{restaurant.name}</h3>
            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <span className="font-medium text-sm">
                {restaurant.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground text-sm">
                ({restaurant.total_reviews})
              </span>
            </div>
          </div>

          {restaurant.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {restaurant.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1">
            {restaurant.cuisine_types.slice(0, 3).map((cuisine) => (
              <Badge key={cuisine} variant="outline" className="text-xs">
                {cuisine}
              </Badge>
            ))}
            {restaurant.cuisine_types.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{restaurant.cuisine_types.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{estimatedDelivery}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span className="truncate max-w-32">
                {restaurant.address.split(',')[0]}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}