from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import GPUListingViewSet, BidViewSet, CurrentUserView

router = DefaultRouter()
router.register(r'listings', GPUListingViewSet)
router.register(r'bids', BidViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include('api.urls')),  # This will include the auth URLs
    path('api/current-user/', CurrentUserView.as_view(), name='current_user'),
]