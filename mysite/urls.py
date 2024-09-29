from django.urls import path
from . import views

urlpatterns=[
    #urls for web pages
    path('',views.mysite, name='mysite'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path("logout/", views.logout_view, name="logout"),
    # path('home/', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('planning/' , views.planning, name='planning'),
    path('soil/', views.soil, name='soil'),
    path('pest/', views.pest, name='pest'),
    path('financial/',  views.financial, name='financial'),
    path('market/', views.market, name='market'),
    # path('community/', views.community, name='community'),
    path('tips/', views.tips, name='tips'),
    path('grants/', views.grants, name='grants'),
    path('livestock/', views.livestock, name='livestock'),
    path('sustainability/', views.sustainability, name="sustainability"),
    path('prediction/', views.prediction, name='prediction'),

    #urls for data retrieval 
    path('get_dashboard_data/',views.get_dashboard_data, name='get_dashboard_data'),
    path('fertilizer-suggestion/', views.get_fertilizer_suggestion, name='fertilizer-suggestion')
]