from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

user = "postgres"
password = "Samie1204$%"
DB_CONFIG = f"postgresql+asyncpg://{user}:{password}$@localhost:5432/Login"



SECRET_KEY = "Samie1204"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class AsyncDatabaseSession:
    def __init__(self) -> None:
        self.session = None
        self.engine = None
        
    def __getattr__(self, name):
        return getattr(self.session, name)
    
    def init(self):
        print(DB_CONFIG)
        self.engine = create_async_engine(DB_CONFIG, future=True, echo=True)
        self.session = sessionmaker(self.engine, expire_on_commit=False, class_=AsyncSession)()
        
    async def create_all(self):
        async with self.engine.begin() as con:
            await con.run_sync(SQLModel.metadata.create_all)

db = AsyncDatabaseSession()

async def commit_rollback():
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise
            
    