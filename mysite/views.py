from django.shortcuts import render,redirect  
from .models import USERS, DASHBOARD,FARMING_TIPS, SOIL_HEALTH,PEST_DISEASE,LIVESTOCK_BREEDING,LIVESTOCK_FEEDING,LIVESTOCK_HEALTH,EXPENSE_TRACKING,INCOME_TRACKING,BUDGET,SUSTAINABLE_PRACTICE
from django.contrib.auth import authenticate,login,logout
from django.contrib import messages
from django.http import JsonResponse
import json
import joblib, os
import pandas as pd

# Create your views here.
def mysite(request):
    return render(request, 'index.html')

def signup(request):
    #For POST requests
    if request.method == 'POST':
        fname =request.POST.get('fname')
        lname =request.POST.get('lname')
        email = request.POST.get('myemail')
        phone_number =request.POST.get('tellno')
        country =request.POST.get('country')
        town =request.POST.get('town')
        dob =request.POST.get('date')
        gender =request.POST.get('gender')
        password =request.POST.get('password')
        confirm_password =request.POST.get('confirm')

        #check if passwords match
        if password != confirm_password:
            messages.error(request, "Passwords do not march.")
            return render(request, 'signup.html') 
        
        #prevent user from registering twice
        if USERS.objects.filter(email=email).exists():
            messages.error(request,"Email is already in use.")
            return render(request , 'signup.html')
        
        #save user to the USERS table
        user= USERS.objects.create_user(
            username=email,
            email =email,
            first_name =fname,
            last_name =lname,
            PHONENUMBER =phone_number,
            COUNTRY =country,
            TOWN =town,
            DOB =dob,
            GENDER =gender,
            password=password
        )
        user.save()
        login(request, user)

        #redirect to login page after successful signup
        return redirect('dashboard')

    #For GET requests , render the signup html file
    return render(request, 'signup.html')


def login_view(request):
    #For POST requests
    if request.method == 'POST':
        email= request.POST.get('myemail')
        password = request.POST.get('pass')

        try:
            user= USERS.objects.get(username=email)
        except USERS.DoesNotExist:
            messages.error(request, 'Email not found')
            return render(request, 'login.html')

        user= authenticate(request,username=email, password=password)
        #authenticate User
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request,'Invalid Email and Password')
            return render(request, 'login.html')

    #For GET requests , render the signup html file
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

def home(request):
    return render(request, 'home.html')

def dashboard(request):
    if request.user.is_authenticated:
        user_id =request.user.id
    #POST request
        if request.method == "POST":
            linkedin =request.POST.get('linkedin')
            instagram = request.POST.get('instagram')
            x = request.POST.get('x')
            tiktok = request.POST.get('tiktok')
            facebook =request.POST.get('facebook')
            metrics =request.POST.get('metrics')
            cultivated_land =request.POST.get('total-area')
            crops_grown =request.POST.get('crop-status')
            livestock_reared =request.POST.get('livestock-reared')
            labour_type =request.POST.get('labour-type')
            total_workers =request.POST.get('total-workers')
            recent_activities =request.POST.get('recent-activities')

            user =USERS.objects.get(id=user_id) 

            user.LINKEDIN = linkedin,
            user.INSTAGRAM = instagram,
            user.X = x,
            user.TIKTOK = tiktok,
            user.FACEBOOK =facebook
    
            user.save()

            dashboard_data=DASHBOARD(
                CULTIVATED_LAND = cultivated_land + metrics,
                CROP_TYPES = crops_grown,
                LIVESTOCK_STATUS =livestock_reared,
                LABOUR_TYPE =labour_type,
                NO_WORKERS =total_workers,
                RECENT_ACTIVITIES =recent_activities,
                USER_ID =user
            )

            dashboard_data.save()

    return render(request, 'farmDashboard.html')

def get_dashboard_data(request):
    if request.user.is_authenticated:
        try:
            user=USERS.objects.get(id=request.user.id)
            print(user)

            #check if user has data in the DASHBOARD table
            has_data= DASHBOARD.objects.filter(USER_ID=request.user).exists()
            print('Has Data: ',has_data)

            if has_data:
                dashboard =DASHBOARD.objects.get(USER_ID=user) 
                data= { 
                    'has_data': has_data,
                    'fname': user.first_name,
                    'lname': user.last_name,
                    'country': user.COUNTRY,
                    'town': user.TOWN,
                    'dob': str(user.DOB),
                    'gender' : user.GENDER,
                    'phone_number': user.PHONENUMBER,
                    'email' : user.email,
                    'linkedin':user.LINKEDIN,
                    'instagram': user.INSTAGRAM,
                    'x' : user.X,
                    'tiktok': user.TIKTOK,
                    'facebook': user.FACEBOOK,
                    'cultivated_land': dashboard.CULTIVATED_LAND,
                    'crops_grown': dashboard.CROP_TYPES,
                    'livestock_reared': dashboard.LIVESTOCK_STATUS,
                    'labour_type': dashboard.LABOUR_TYPE,
                    'total_workers': dashboard.NO_WORKERS,
                    'recent_activities': dashboard.RECENT_ACTIVITIES
                }
            else:
                data ={
                    'has_data': False
                }
            return JsonResponse(data)
        except USERS.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status =404)
        except DASHBOARD.DoesNotExist:
             # If the user exists but dashboard data does not
            return JsonResponse({'has_data':False})
    else:
        return JsonResponse({'error': 'User not authenticated'}, status=403)

def planning(request):
    return render(request, 'cropPlanning.html')

def soil(request):        
    return render(request, 'soilHealth.html')

def get_fertilizer_suggestion(request):
    data = request.body.decode('utf-8')
    print('Raw Data', data)
    data = json.loads(data)
    print(data)
    crop_name = data.get('crop_name')
    soil_type = data.get('soil_type')

    try:
        suggestion =SOIL_HEALTH.objects.get(CROP_NAME=crop_name, SOIL_TYPE=soil_type)
        data ={'suggestion': suggestion.SUGGESTION}
        
        return JsonResponse(data)
    except SOIL_HEALTH.DoesNotExist:
        return JsonResponse({'error': 'No suggestion found'})
def pest(request):
    return render(request, 'pestDisease.html')

def livestock(request):
    if request.user.is_authenticated:
        user_id=request.user.id
        user= USERS.objects.get(id=user_id)

        if request.method == 'POST':
            data = request.body.decode('utf-8')
            print(f"Raw request body: {data}")
            data = json.loads(data)
            print('Data', list(data.keys())[0])

            if list(data.keys())[0] == "animal_id":
                animal_id= data.get('animal_id')
                vaccination = data.get('vaccination')
                illness = data.get('illness')
                treatment =data.get('treatment')
            
                print(animal_id, '\n', vaccination, '\n', illness, '\n', treatment)

                try:
                    livestock_health_data = LIVESTOCK_HEALTH.objects.create(
                        ANIMAL_ID=animal_id,
                        VACCINATION_DATE=vaccination,
                        ILLNESS_HISTORY=illness,
                        TREATMENT_HISTORY=treatment,
                        USER_ID= user
                    )

                    data ={
                        'status': 'success',
                        'data': {
                            'animal_id': livestock_health_data.ANIMAL_ID,
                            'vaccination': livestock_health_data.VACCINATION_DATE,
                            'illness': livestock_health_data.ILLNESS_HISTORY,
                            'treatment' : livestock_health_data.TREATMENT_HISTORY
                        }
                    }
                    return JsonResponse(data)
                except Exception as e:
                    data={
                        'status': 'error',
                        'message': str(e)
                    }
                    return JsonResponse(data)
                
            elif list(data.keys())[0] == 'animal_category':
                animal_category= data.get('animal_category')
                feed_amount = data.get('feed_amount')
                feed_time = data.get('feed_time')
            
                print(animal_category, '\n', feed_amount, '\n', feed_time)

                try:
                    livestock_feeding_data = LIVESTOCK_FEEDING.objects.create(
                    ANIMAL_CATEGORY = animal_category,
                    FEED_AMOUNT =feed_amount,
                    FEEDING_TIME =feed_time,
                    USER_ID =user
                    )

                    data ={
                        'status': 'success',
                        'data': {
                            'animal_category': livestock_feeding_data.ANIMAL_CATEGORY,
                            'feed_amount': livestock_feeding_data.FEED_AMOUNT,
                            'feed_time': livestock_feeding_data.FEEDING_TIME,
                        }
                    }
                    return JsonResponse(data)
                except Exception as e:
                    data={
                        'status': 'error',
                        'message': str(e)
                    }
                    return JsonResponse(data)
                
            elif list(data.keys())[0] == 'animals_id':
                animal_id= data.get('animals_id')
                last_breeding = data.get('last_breeding')
                next_breeding = data.get('next_breeding')
            
                print(animal_id, '\n', last_breeding, '\n', next_breeding)

                try:
                    livestock_breeding_data = LIVESTOCK_BREEDING.objects.create(
                    ANIMAL_ID =animal_id,
                    LAST_BREEDING=last_breeding,
                    EXPECTED_BIRTH= next_breeding,
                    USER_ID =user
                    )

                    data ={
                        'status': 'success',
                        'data': {
                            'animal_id': livestock_breeding_data.ANIMAL_ID,
                            'last_breeding': livestock_breeding_data.LAST_BREEDING,
                            'next_breeding': livestock_breeding_data.EXPECTED_BIRTH,
                        }
                    }
                    return JsonResponse(data)
                except Exception as e:
                    data={
                        'status': 'error',
                        'message': str(e)
                    }
                    return JsonResponse(data)
                

        health = LIVESTOCK_HEALTH.objects.filter(USER_ID=user)
        feeding = LIVESTOCK_FEEDING.objects.filter(USER_ID=user)
        breeding=  LIVESTOCK_BREEDING.objects.filter(USER_ID=user) 

        #GET request
        return render(request, 'livestock.html', {'health': health, 'feeding': feeding, 'breeding':breeding})

def financial(request):
    if request.user.is_authenticated:
        user_id=request.user.id
        user= USERS.objects.get(id=user_id)

        if request.method == 'POST':
            data = request.body.decode('utf-8')
            print(f"Raw request body: {data}")
            data = json.loads(data)
            print('Data', list(data.keys())[0])

            if list(data.keys())[0] == "expense_type":
                expense_type= data.get('expense_type')
                amount = data.get('amount')
                date = data.get('date')
            
                print(expense_type, '\n', amount, '\n', date)

                try:
                    financial = EXPENSE_TRACKING.objects.create(
                        EXPENSE_TYPE=expense_type,
                        AMOUNT=amount,
                        DATE=date,
                        USER_ID= user
                    )

                    data ={
                        'status': 'success',
                        'data': {
                            'expense_type': financial.EXPENSE_TYPE,
                            'amount': financial.AMOUNT,
                            'date': financial.DATE
                        }
                    }
                    return JsonResponse(data)
                except Exception as e:
                    data={
                        'status': 'error',
                        'message': str(e)
                    }
                    return JsonResponse(data)
                
            elif list(data.keys())[0] == 'product':
                product= data.get('product')
                quantity = data.get('quantity')
                unit = data.get('unit')
                price = data.get('price')
                date = data.get('date')
                buyer = data.get('buyer')
            
                print(product, '\n', quantity, '\n', price, '\n', date)

                try:
                    income = INCOME_TRACKING.objects.create(
                        PRODUCT_NAME= product,
                        QUANTITY= quantity + unit,
                        AMOUNT =price,
                        DATE=date,
                        BUYER_NAME =buyer,
                        USER_ID= user
                    )

                    data ={
                        'status': 'success',
                        'data': {
                            'product': income.PRODUCT_NAME,
                            'quantity': income.QUANTITY,
                            'price':income.AMOUNT,
                            'date' : income.DATE,
                            'buyer' : income.BUYER_NAME
                        }
                    }
                    return JsonResponse(data)
                except Exception as e:
                    data={
                        'status': 'error',
                        'message': str(e)
                    }
                    return JsonResponse(data)
                
            elif list(data.keys())[0] == 'category':
                category= data.get('category')
                amount = data.get('amount')
                description = data.get('description')
            
                print(category, '\n', amount, '\n', description)

                try:
                    budget_data = BUDGET.objects.create(
                        BUDGET_CATEGORY= category,
                        BUDGET_AMOUNT=  amount,
                        BUDGET_DESCRIPTION = description,
                        USER_ID= user
                    )

                    data ={
                        'status': 'success',
                        'data': {
                            'category': budget_data.BUDGET_CATEGORY,
                            'amount': budget_data.BUDGET_AMOUNT,
                            'description':budget_data.BUDGET_DESCRIPTION,
                        }
                    }
                    return JsonResponse(data)
                except Exception as e:
                    data={
                        'status': 'error',
                        'message': str(e)
                    }
                    return JsonResponse(data)
                

        expenses = EXPENSE_TRACKING.objects.filter(USER_ID=user)
        income = INCOME_TRACKING.objects.filter(USER_ID=user)
        budget= BUDGET.objects.filter(USER_ID=user) 
        return render(request, 'farmFinancials.html',{'expenses': expenses, 'income': income, 'budget': budget})

def market(request):

    return render(request, 'marketPrice.html')

# def community(request):
#     return render(request, 'community.html')

def tips(request):
    return render(request, 'farmingTips.html')

def grants(request):
    return render(request, 'govtGrants.html')

def sustainability(request):
    if request.user.is_authenticated:
        user_id=request.user.id
        user= USERS.objects.get(id=user_id)

        if request.method == 'POST':
            data = request.body.decode('utf-8')
            print(f"Raw request body: {data}")
            data = json.loads(data)
            print('Data', list(data.keys())[0])

            practice= data.get('practice')
            area = data.get('area')
            unit=data.get('unit')
            description = data.get('description')
        
            print(practice, '\n', area, '\n',unit, '\n', description)

            try:
                sustainability_data = SUSTAINABLE_PRACTICE.objects.create(
                    PRACTICE= practice,
                    AREA_COVERED=  area + unit,
                    DESCRIPTION = description,
                    USER_ID= user
                )

                data ={
                    'status': 'success',
                    'data': {
                        'practice': sustainability_data.PRACTICE,
                        'area': sustainability_data.AREA_COVERED,
                        'description':sustainability_data.DESCRIPTION,
                    }
                }
                return JsonResponse(data)
            except Exception as e:
                data={
                    'status': 'error',
                    'message': str(e)
                }
                return JsonResponse(data)
    practices = SUSTAINABLE_PRACTICE.objects.filter(USER_ID=user)           
    return render(request, 'sustainability.html', {'practices': practices})

def prediction(request):
    if request.user.is_authenticated:
        user_id=request.user.id
        user= USERS.objects.get(id=user_id)

        if request.method == 'POST':
            data = request.body.decode('utf-8')
            print(f"Raw request body: {data}")
            data = json.loads(data)
            print('Data', list(data.keys())[0])

            crop_type= data.get('crop_type')
            soil_type = data.get('soil_type')
            rainfall=data.get('rainfall')
            temperature = data.get('temperature')
            fertilizer =data.get('fertilizer')
            area =data.get('area')
        
            print(crop_type, '\n', area, '\n',soil_type, '\n', rainfall, '\n', temperature, '\n', fertilizer)

            try:
                # Ensure numeric values are properly converted
                rainfall = float(rainfall)
                temperature = float(temperature)
                fertilizer = float(fertilizer)
                area = float(area)

            except ValueError:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Invalid numeric values. Ensure rainfall, temperature, fertilizer, and area are numeric.'
                })

            try:
               # Get the base directory (the root of the project)
               BASE_DIR = os.path.dirname(os.path.abspath(__file__))

                # Paths to the model and encoders
               model_path = os.path.join(BASE_DIR, 'Machine_Learning', 'crop_yield_model.pkl')
               encoders_path = os.path.join(BASE_DIR, 'Machine_Learning', 'label_encoders.pkl')
               print(model_path, '\n', encoders_path)
                #load the trained model
               model =joblib.load(model_path)

                # Load the separate encoders for 'crop' and 'soil'
               encoders = joblib.load(encoders_path)
               crop_encoder = encoders['crop']
               soil_encoder = encoders['soil']

                # Check if the provided crop and soil types exist in the encoders
               if crop_type not in crop_encoder.classes_ or soil_type not in soil_encoder.classes_:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Unseen crop type or soil type. Ensure valid categories are provided.'
                    })

               #encoding categorical inputs
               crop_encoded = crop_encoder.transform([crop_type])[0]
               soil_encoded = soil_encoder.transform([soil_type])[0]

               #prepare input data for prediction
               input_data = pd.DataFrame([[crop_encoded, soil_encoded, rainfall, temperature, fertilizer, area]],
                                          columns=['crop', 'soil', 'rainfall', 'temperature', 'fertilizer', 'area'])
               print(f"Input Data: {input_data}")

               #make the prediction
               predicted_yield =model.predict(input_data)[0]
               print(f"Predicted Yield: {predicted_yield}")

               data ={
                    'status': 'success',
                    'data': {
                        'yield' : round(predicted_yield,2)
                    }
                }
               return JsonResponse(data)
            except Exception as e:
                print(f"Error: {str(e)}")
                data={
                    'status': 'error',
                    'message': str(e)
                }
                return JsonResponse(data)
    #GET request
    return render(request,'yieldPrediction.html')