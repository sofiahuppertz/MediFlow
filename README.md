# Anesthesia Prediction Models

This branch contains the code used for the creation of two ML models (training notebook, inference scripts, datasets and models) for anesthesia-related predictions:
1. A model to predict the upper bound (90% confidence) of anesthesia duration for surgical operations
2. A model to predict potential complications after anesthesia (binary classification)

These models are integrated into the workflow of the MediFlow app

## Project Overview

### Anesthesia Complication Prediction Model

This model is designed to detect potential complications after anesthesia. 
It helps medical staff to:

1. Identify high-risk patients
2. Notify doctors of the risk

### Anesthesia Duration Prediction Model

This model estimates the maximum likely duration of anesthesia for various surgical procedures. 
By providing an upper bound estimate with 90% confidence, it helps medical staff and administrators to:

1. Efficiently schedule surgeries
2. Allocate resources more effectively
3. Reduce delays and cancellations

## Branch Structure

The branch has the following structure:

- `inference_code_prediction_complication.py`: Python script to run the inference of the post-anesthesia complication prediction model.
- `inference_code_duration_anesthesia.py`: Python script to run the inference of the anesthesia duration prediction model.

## Model Training

Two separate notebooks are used for training the models:

1. Complication Prediction Model: This notebook trains a system to detect potential complications after anesthesia. it trains an xgboost with a customized prediction threshold
2. Anesthesia Duration Prediction Model: This notebook trains a model to predict the upper bound (90% confidence) of anesthesia duration. it is a lightgbm model trained with a quantile loss

## Usage

Run this code idealy on python version 3.12.8

Run the appropriate inference script for your needs:
   ```
   python inference_code_prediction_complication.py
   ```
   or
   ```
   python inference_code_duration_anesthesia.py
   ```

## Data Used for Training

The duration prediction model was trained using data from the VitalDB dataset. 
For more information about the dataset, visit:
https://vitaldb.net/dataset/?query=overview#h.1fo5zknztqnw

The post-anesthesia complication model was trained using the datas contained here:
https://www.kaggle.com/datasets/omnamahshivai/surgical-dataset-binary-classification/code