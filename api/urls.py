from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterAPIView, LoginAPIView, #LogoutAPIView,
    BidViewSet, GPUListingViewSet, CurrentUserView
)

router = DefaultRouter()
router.register(r'bids', BidViewSet)
router.register(r'listings', GPUListingViewSet) #Sends the request to GPUListingViewSet

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterAPIView.as_view(), name='register'), #After the request comes from backend, RegisterAPIView is invoked
    path('login/', LoginAPIView.as_view(), name='login'),
    #path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('user/', CurrentUserView.as_view(), name='current_user'),
]