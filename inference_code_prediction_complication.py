import pickle
import pandas as pd

def load_model(model_path='models_and_preprocessing/model_prediction_complication.pkl'):
    with open(model_path, 'rb') as f:
        return pickle.load(f)

def inference_pipeline(data, model_path='models_and_preprocessing/model_prediction_complication.pkl'):
    # Load model and preprocessor
    model = load_model(model_path)
    y_prob = model.predict_proba(data)[:, 1]
    threshold = 0.18
    pred_custom = (y_prob >= threshold).astype(int)
    return pred_custom

def main():
    data = pd.read_csv("samples/sample_complication_prediction.csv")
    predictions = inference_pipeline(data, model_path='models_and_preprocessing/model_prediction_complication.pkl')
    pd.DataFrame(predictions, columns=["predicted_complication"]).to_csv("predictions/predictions_complication.csv", index=False)
    print('Inference was succesful')
main()

