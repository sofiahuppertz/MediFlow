import pickle
import pandas as pd
import joblib

def load_and_apply_transformers(df, save_path='preprocessor.pkl'):
    with open(save_path, 'rb') as f:
        preprocessor = pickle.load(f)

    df_processed = preprocessor.transform(df)
    return df_processed


def inference_pipeline(loaded_model,data):
    preprocessed_data = load_and_apply_transformers(data)
    # print(preprocessed_data.shape)
    predictions = loaded_model.predict(preprocessed_data)
    return predictions

sample = pd.read_csv("sample.csv")
sample_curated = sample.drop(columns=["caseid","duration_operation","duration_anesthesia"])
loaded_model = joblib.load('quantile_model_90.joblib')
predictions = inference_pipeline(loaded_model,sample_curated)

predictions = pd.DataFrame(predictions, columns=["predicted_duration"]).to_csv("predictions.csv", index=False)