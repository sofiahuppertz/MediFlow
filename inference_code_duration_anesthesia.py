import pickle
import pandas as pd
import joblib

def load_and_apply_transformers(df, save_path='models_and_preprocessing/preprocessor_duration_anesthesia.pkl'):
    """
    Load preprocessor from a pickle file and transform the input DataFrame.
    
    Args:
        df (pd.DataFrame): Input DataFrame to be transformed
        save_path (str): Path to the saved preprocessor pickle file
        
    Returns:
        pd.DataFrame: Transformed DataFrame
    """
    with open(save_path, 'rb') as f:
        preprocessor = pickle.load(f)

    df_processed = preprocessor.transform(df)
    return df_processed


def inference_pipeline(loaded_model,data):
    """
    Run the inference pipeline for anesthesia duration prediction.
    
    Args:
        loaded_model: Trained model object for making predictions
        data (pd.DataFrame): Input data for prediction
    
    Returns:
        numpy.ndarray: Predicted anesthesia durations
    """
    preprocessed_data = load_and_apply_transformers(data)
    # print(preprocessed_data.shape)
    predictions = loaded_model.predict(preprocessed_data)
    return predictions

sample = pd.read_csv("samples/sample_duration_anesthesia.csv")
sample_curated = sample.drop(columns=["caseid","duration_operation","duration_anesthesia"])
loaded_model = joblib.load('models_and_preprocessing/quantile_model_90_duration_anesthesia.joblib')
predictions = inference_pipeline(loaded_model,sample_curated)

predictions = pd.DataFrame(predictions, columns=["predicted_duration"]).to_csv("predictions/predictions_duration.csv", index=False)