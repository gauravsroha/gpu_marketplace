from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

class GPUListing(models.Model):
    title = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    seller_name = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(default=timezone.now() + timedelta(days=7))  # Default to 7 days from now
    current_highest_bid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.title
    
    def has_ended(self):
        return timezone.now() > self.end_time

    def save(self, *args, **kwargs):
        if self.seller: #If the seller exists assign the seller_name field and then only save
            self.seller_name = self.seller.username
        super().save(*args, **kwargs)


class Bid(models.Model):
    listing = models.ForeignKey(GPUListing, on_delete=models.CASCADE, related_name='bids')
    bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bids')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-amount']  #Priority queue like structure, orders in Decreasing order

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update the listing's current highest bid
        highest_bid = Bid.objects.filter(listing=self.listing).order_by('-amount').first()
        if highest_bid:
            self.listing.current_highest_bid = highest_bid.amount
        else:
            self.listing.current_highest_bid = None
        self.listing.save()