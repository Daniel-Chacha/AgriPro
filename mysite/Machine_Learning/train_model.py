import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import joblib
import os

# Load the dataset directly since it's in the same directory
data = pd.read_csv('crop_data.csv')

# Print the column names for debugging
print("Columns in dataset:", data.columns)

# Clean up the column names (strip spaces and lowercase them for consistency)
data.columns = data.columns.str.strip().str.lower()

# Initialize separate LabelEncoders for 'crop' and 'soil'
crop_encoder = LabelEncoder()
soil_encoder = LabelEncoder()

# Encode the 'Crop' column (categorical)
if 'crop' in data.columns:
    data['crop'] = crop_encoder.fit_transform(data['crop'])
else:
    raise KeyError("'Crop' column is missing from the dataset.")

# Encode the 'Soil' column (categorical)
if 'soil' in data.columns:
    data['soil'] = soil_encoder.fit_transform(data['soil'])
else:
    raise KeyError("'Soil' column is missing from the dataset.")

# Ensure 'Area' (cultivated land) is present and numeric
if 'area' in data.columns:
    data['area'] = pd.to_numeric(data['area'], errors='coerce')
    if data['area'].isnull().any():
        raise ValueError("'Area' contains non-numeric values.")
else:
    raise KeyError("'Area' column is missing from the dataset.")

# Check other numeric fields and convert them if necessary
numeric_columns = ['rainfall', 'temperature', 'fertilizer']
for col in numeric_columns:
    if col in data.columns:
        data[col] = pd.to_numeric(data[col], errors='coerce')
        if data[col].isnull().any():
            raise ValueError(f"'{col}' contains non-numeric values.")
    else:
        raise KeyError(f"'{col}' column is missing from the dataset.")

# Define the features (X) and target (y)
X = data[['crop', 'soil', 'rainfall', 'temperature', 'fertilizer', 'area']]  # Features
y = data['yield']  # Target variable: 'yield'

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a RandomForestRegressor model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict on the test set
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
print(f"Model Mean Squared Error: {mse}")

# Save the model and the encoders to disk using joblib
joblib.dump(model, 'crop_yield_model.pkl')

# Save the encoders as a dictionary (for separate 'crop' and 'soil' encoding)
encoders = {'crop': crop_encoder, 'soil': soil_encoder}
joblib.dump(encoders, 'label_encoders.pkl')

print("Model saved as 'crop_yield_model.pkl'")
print("Label encoders saved as 'label_encoders.pkl'")
