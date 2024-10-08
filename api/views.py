from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils import timezone
from django.db.models import Max
from .serializers import UserSerializer, GPUListingSerializer, BidSerializer
from .permissions import IsOwnerOrReadOnly
from .models import GPUListing, Bid

class RegisterAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data) #creates a serializer object of type UserSerializer with the data receiver from the request
        if serializer.is_valid(): 
            user = serializer.save() #Creates a new user
            refresh = RefreshToken.for_user(user) #generate a refresh token
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token), #The jwt token which is used for authorization 
                'user': serializer.data #serialized data of the user 
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView): 
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user: #If authentication successfull
            refresh = RefreshToken.for_user(user)
            return Response({ #The response is sent with access token to be stored in order to keep authentication
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

#class LogoutAPIView(APIView):
    #permission_classes = (IsAuthenticated)

    #def post(self, request):
       # try:
        #    refresh_token = request.data["refresh_token"]
        #    token = RefreshToken(refresh_token)
        #    token.blacklist()
        #    return Response(status=status.HTTP_205_RESET_CONTENT)
        #except Exception as e:
         #   return Response(status=status.HTTP_400_BAD_REQUEST) 

class BidViewSet(viewsets.ModelViewSet):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer): #Method called after a new bid is created and extracting id and amount from the request
        listing = serializer.validated_data['listing']
        amount = serializer.validated_data['amount']

        if listing.seller == self.request.user:
            raise serializers.ValidationError("You cannot bid on your own listing")

        if listing.end_time < timezone.now():
            raise serializers.ValidationError("This auction has ended")

        if listing.current_highest_bid and amount <= listing.current_highest_bid:
            raise serializers.ValidationError("Bid must be higher than current highest bid")

        if amount <= listing.price:
            raise serializers.ValidationError("Bid must be higher than starting price")

        bid = serializer.save(bidder=self.request.user)
        listing.current_highest_bid = amount
        listing.save()

    def destroy(self, request, *args, **kwargs):
        try:
            bid = self.get_object()
            listing = bid.listing

            if bid.bidder != request.user:
                return Response(
                    {"error": "You can only delete your own bids"}, 
                    status=status.HTTP_403_FORBIDDEN
                )

            # Store the amount before deleting
            deleted_bid_amount = bid.amount
            
            # Delete the bid
            bid.delete()

            # Find the new highest bid
            highest_bid = Bid.objects.filter(listing=listing).order_by('-amount').first() 
            
            # Update the listing's current_highest_bid
            if highest_bid:
                listing.current_highest_bid <= highest_bid.amount
            else:
                listing.current_highest_bid = None
            
            listing.save()

            # Return success response
            return Response({
                "message": "Bid deleted successfully",
                "new_highest_bid": listing.current_highest_bid
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class GPUListingViewSet(viewsets.ModelViewSet):
    queryset = GPUListing.objects.all() #fetches all the GPUListingobjects
    serializer_class = GPUListingSerializer 
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer): #Used to save a new GPUListing object
        serializer.save(seller=self.request.user) #Current user gets saved as the seller

    def destroy(self, request, *args, **kwargs):
        listing = self.get_object()

        if listing.seller != request.user:
            return Response({"error": "You can only delete your own listings"}, status=status.HTTP_403_FORBIDDEN)

        listing.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def my_listings(self, request):
        listings = GPUListing.objects.filter(seller=request.user) #Gets the listings of the current user
        serializer = self.get_serializer(listings, many=True)
        return Response(serializer.data) #Sends the list of user listings to frontend

    @action(detail=False, methods=['get'])
    def my_bids(self, request):
        bids = Bid.objects.filter(bidder=request.user) #Gets the bids of the current user
        listings = GPUListing.objects.filter(bids__in=bids).distinct().prefetch_related('bids')
        serializer = self.get_serializer(listings, many=True)
        return Response(serializer.data)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated] #IF user is authenticated, he can do CRUD operations to his listing and bids 

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)