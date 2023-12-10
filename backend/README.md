1. Start ec2
2. cd into backend
3. run this command
   nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 &
4. close ec2 and open
   http://18.220.228.7:8000/docs
