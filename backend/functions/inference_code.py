import pickle
import pandas as pd
import joblib
class Inference:
        
    def load_and_apply_transformers(self,df, save_path='/app/functions/preprocessor.pkl'):
        with open(save_path, 'rb') as f:
            preprocessor = pickle.load(f)

        df_processed = preprocessor.transform(df)
        return df_processed


    def inference_pipeline(self,loaded_model,data):
        preprocessed_data = self.load_and_apply_transformers(data)
        # print(preprocessed_data.shape)
        predictions = loaded_model.predict(preprocessed_data)
        return predictions

    def main(self,input):
        print("Start inference")
        sample = pd.read_csv("/app/functions/sample.csv")
        sample_curated = sample.drop(columns=["caseid","duration_operation","duration_anesthesia"])
        loaded_model = joblib.load('/app/functions/quantile_model_90.joblib')
        predictions = self.inference_pipeline(loaded_model,sample_curated)
        # predictions = pd.DataFrame(predictions, columns=["predicted_duration"]).to_csv("predictions.csv", index=False)
        print("Stop inference")
        return predictions[1]
    
