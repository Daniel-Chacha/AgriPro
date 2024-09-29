from django.contrib import admin
from .models import USERS, DASHBOARD,FARMING_TIPS, SOIL_HEALTH,PEST_DISEASE,LIVESTOCK_BREEDING,LIVESTOCK_FEEDING,LIVESTOCK_HEALTH,EXPENSE_TRACKING,INCOME_TRACKING,BUDGET,SUSTAINABLE_PRACTICE

# Register your models here.
admin.site.register(USERS)
admin.site.register(DASHBOARD)
admin.site.register(FARMING_TIPS)
admin.site.register(SOIL_HEALTH)
admin.site.register(PEST_DISEASE)
admin.site.register(LIVESTOCK_BREEDING)
admin.site.register(LIVESTOCK_HEALTH)
admin.site.register(LIVESTOCK_FEEDING)
admin.site.register(EXPENSE_TRACKING)
admin.site.register(INCOME_TRACKING)
admin.site.register(BUDGET)
admin.site.register(SUSTAINABLE_PRACTICE)
