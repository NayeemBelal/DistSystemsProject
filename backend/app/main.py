import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import db
from backend.app.service.auth_service import generate_role

origins = [
    "http://127.0.0.1:5173"
]

def init_app():
    db.init()
    
    app= FastAPI(
        title="Nayeem's App",
        description= "Login Page",
        version= "1",
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"], 
        allow_headers=["*"],
    )
    
    @app.on_event("startup")
    async def on_startup():
        await db.create_all()
        await generate_role()

    @app.on_event("shutdown")
    async def on_shutdown():
        await db.close()
    
    
    from backend.app.controller import authentification, users
    app.include_router(authentification.router)
    app.include_router(users.router)
    
    
    return app

app = init_app()
    


def start():
    """Launched with 'poetry run start' at root level """

    uvicorn.run("app.main:app", host="localhost", port=8888, reload=True)

