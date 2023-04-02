from database import session, User, Book
from db_controls import add_new_item
from werkzeug.security import generate_password_hash


book = session.query(User).first()
print(book, "query")