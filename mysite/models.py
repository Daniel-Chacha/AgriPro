from django.db import models
from datetime import date
from django.contrib.auth.models import AbstractUser

# Create your models here.
class USERS(AbstractUser):
    PHONENUMBER = models.CharField(max_length=15)
    COUNTRY = models.CharField(max_length=100)
    TOWN = models.CharField(max_length=100)
    DOB = models.DateField(null=True, blank=True)
    GENDER = models.CharField(max_length=10)
    LINKEDIN = models.URLField(max_length=200, blank=True, null=True)
    X = models.URLField(max_length=200, blank=True, null=True)
    INSTAGRAM = models.URLField(max_length=200, blank=True, null=True)
    TIKTOK = models.URLField(max_length=200, blank=True, null=True)
    FACEBOOK = models.URLField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f'{self.first_name}{self.last_name}'

class DASHBOARD(models.Model):
    CULTIVATED_LAND = models.CharField(max_length=50)
    CROP_TYPES = models.TextField()
    LIVESTOCK_STATUS =models.CharField(max_length=200)
    LABOUR_TYPE = models.TextField(max_length=50)
    NO_WORKERS = models.IntegerField()
    RECENT_ACTIVITIES =models.TextField()
    USER_ID = models.ForeignKey(USERS, on_delete=models.CASCADE)

    def __str__(self):
        return f' Cultivated Land: {self.CULTIVATED_LAND},Crop Types: {self.CROP_TYPES}'
    
class FARMING_TIPS(models.Model):
    CROP_CARE = models.URLField(max_length=200)
    TECHNIQUES = models.URLField(max_length=200)

    def __str__(self):
        return f'Crop Care Videos:{self.CROP_CARE}, Techniques: {self.TECHNIQUES}'
    
class SOIL_HEALTH(models.Model):
    CROP_NAME = models.TextField(max_length=20)
    SOIL_TYPE = models.TextField(max_length=20)
    SUGGESTION = models.CharField(max_length=400)

    def __str__(self):
        return f'Crop Name: {self.CROP_NAME}, Soil Type: {self.SOIL_TYPE}'
    
    
class PEST_DISEASE(models.Model):
    PEST_NAME = models.TextField(20)
    DEFINITION = models.TextField(max_length=200)
    VIDE0_URL= models.URLField(max_length=200)
    TREATMENT = models.TextField(max_length=500)

    def __str__(self):
        return f'Pest Name:{self.PEST_NAME}, Definition: {self.DEFINTION}'
    

class LIVESTOCK_HEALTH(models.Model):
    ANIMAL_ID = models.CharField(max_length=20)
    VACCINATION_DATE= models.DateField()
    ILLNESS_HISTORY = models.CharField(max_length=400)
    TREATMENT_HISTORY = models.CharField(max_length=400)
    USER_ID = models.ForeignKey(USERS, on_delete=models.CASCADE)

    def __str__(self):
        return f'Animal ID: {self.ANIMAL_ID}, Vaccination Date: {self.VACCINATION_DATE}'
    

class LIVESTOCK_FEEDING(models.Model):
    ANIMAL_CATEGORY = models.TextField(max_length=20)
    FEED_AMOUNT = models.CharField(max_length=20)
    FEEDING_TIME= models.TimeField()
    USER_ID = models.ForeignKey(USERS,on_delete=models.CASCADE)

    def __str__(self):
        return f'Animal Category: {self.ANIMAL_CATEGORY}, Feed Amount: {self.FEED_AMOUNT}'
    
class LIVESTOCK_BREEDING(models.Model):
    ANIMAL_ID= models.CharField(max_length=20)
    LAST_BREEDING = models.DateField()
    EXPECTED_BIRTH = models.DateField()
    USER_ID = models.ForeignKey(USERS,on_delete=models.CASCADE)

    def __str__(self):
        return f'Animal ID: {self.ANIMAL_ID}, Last Breeding: {self.LAST_BREEDING}'
    
class EXPENSE_TRACKING(models.Model):
    EXPENSE_TYPE = models.TextField(max_length=20)  
    AMOUNT = models.FloatField(max_length=20)
    DATE= models.DateField()
    USER_ID = models.ForeignKey(USERS,on_delete=models.CASCADE)

    def __str__(self):
        return f'Expense Type: {self.EXPENSE_TYPE}, Amount:{self.AMOUNT}'
    

class INCOME_TRACKING(models.Model):
    PRODUCT_NAME =models.TextField(max_length=20)
    QUANTITY = models.CharField(max_length=20)
    AMOUNT = models.FloatField(max_length=20)
    DATE = models.DateField()
    BUYER_NAME = models.CharField(max_length=20)
    USER_ID = models.ForeignKey(USERS,on_delete=models.CASCADE)

    def __str__(self):
        return f'Product Name: {self.PRODUCT_NAME}, Quantity: {self.QUANTITY}'
    

class BUDGET(models.Model):
    BUDGET_CATEGORY = models.TextField(max_length=20)
    BUDGET_AMOUNT = models.FloatField(max_length=20)
    BUDGET_DESCRIPTION =models.CharField(max_length=400, default="null")
    USER_ID = models.ForeignKey(USERS,on_delete=models.CASCADE)

    def __str__(self):
        return f'Budget Category: {self.BUDGET_CATEGORY}, Amount: {self.BUDGET_AMOUNT}'
       


class SUSTAINABLE_PRACTICE(models.Model):
    PRACTICE= models.TextField(max_length=20)
    AREA_COVERED= models.CharField(max_length=20)
    DESCRIPTION = models.CharField(max_length=400)
    USER_ID =models.ForeignKey(USERS, on_delete=models.CASCADE)

    def __str__(self):
        return f'Practice: {self.PRACTICE}, Area Covered: {self.AREA_COVERED}'
    