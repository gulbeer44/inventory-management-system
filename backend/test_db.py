from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:Gulbeer45%40@localhost:4545/inventory_db"

engine = create_engine(DATABASE_URL)

try:
    connection = engine.connect()
    print("Database Connected Successfully!")
    connection.close()

except Exception as e:
    print("Connection Failed")
    print(e)