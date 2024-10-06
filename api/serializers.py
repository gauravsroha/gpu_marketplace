from rest_framework import serializers
from django.contrib.auth.models import User
from .models import GPUListing, Bid

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class BidSerializer(serializers.ModelSerializer):
    bidder = serializers.ReadOnlyField(source='bidder.username')

    class Meta:
        model = Bid
        fields = ['id', 'listing', 'bidder', 'amount', 'created_at']
        read_only_fields = ['id', 'created_at', 'bidder']

class GPUListingSerializer(serializers.ModelSerializer):
    seller = serializers.ReadOnlyField(source='seller.username')
    seller_name = serializers.ReadOnlyField()
    bids = BidSerializer(many=True, read_only=True)
    current_highest_bid = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = GPUListing
        fields = ['id', 'title', 'price', 'brand', 'model', 'seller', 'seller_name', 
                 'created_at', 'end_time', 'current_highest_bid', 'bids']
        read_only_fields = ['id', 'created_at', 'seller_name', 'current_highest_bid']