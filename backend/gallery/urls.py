from django.urls import path
from . import views

app_name = "gallery"

urlpatterns = [
    path('saveMenu/', views.saveMenu, name='saveMenue'),
    path('<int:image_id>/delImg/', views.delImg, name='delImg'),
    path('myImgs/', views.myImgs, name='myImgs'),
    path('media/image/<str:uri>/', views.getImage, name='getImage'),
    path('getCalendar/', views.getCalendar, name='getCalendar'),
    path('getChart/<str:date>/', views.getChart, name='getChart'),
    path('plusCnt/', views.plusCnt, name='plusCnt'),
    path('minusCnt/', views.minusCnt, name='minusCnt'),
    path('deleteMenu/', views.deleteMenu, name='deleteMenu'),
]