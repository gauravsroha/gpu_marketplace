from rest_framework import serializers
from django.contrib.auth.models import User
from .models import GPUListing, Bid

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) #means that it would not be serialized 

    class Meta:
        model = User #user is already defined in django built in library
        fields = ('id', 'username', 'email', 'password') 

    def create(self, validated_data): #validated_data is the data that is sent as request from frontend
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''), #email is not compulsory, so we return an empty string in case of no email provided
            password=validated_data['password']
        )
        return user

class BidSerializer(serializers.ModelSerializer):
    bidder = serializers.ReadOnlyField(source='bidder.username')

    class Meta: #converts the bid types to simple JSON for easy parsing
        model = Bid
        fields = ['id', 'listing', 'bidder', 'amount', 'created_at']
        read_only_fields = ['id', 'created_at', 'bidder']

class GPUListingSerializer(serializers.ModelSerializer):
    seller = serializers.ReadOnlyField(source='seller.username')
    seller_name = serializers.ReadOnlyField()
    seller_id = serializers.ReadOnlyField(source='seller.id')
    bids = BidSerializer(many=True, read_only=True)
    current_highest_bid = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    has_ended = serializers.BooleanField(read_only=True)

    class Meta: #Defines the GPUListing objects back to json
        model = GPUListing
        fields = ['id', 'title', 'price', 'brand', 'model', 'seller', 'seller_id', 'seller_name', 
                 'created_at', 'end_time', 'current_highest_bid', 'bids', 'has_ended'] 
        read_only_fields = ['id', 'created_at', 'seller_name', 'seller_id', 'current_highest_bid']