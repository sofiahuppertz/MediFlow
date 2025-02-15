FROM python:3.8

WORKDIR /app/
ADD requirements.txt /app/

RUN pip install -r requirements.txt

ADD . /app/

EXPOSE 8005

CMD ["uvicorn", "main:app", "", "0.0.0.0:8000", "--reload"]