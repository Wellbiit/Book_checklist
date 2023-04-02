from .database import session, User, Book
from flask import jsonify
import json


def create_json_from(obj):
    book_dict = obj.__dict__

    book_dict.pop('_sa_instance_state', None)

    book_dict['time'] = book_dict['time'].strftime('%H:%M')
    book_dict['date'] = book_dict['date'].strftime('%Y-%m-%d')

    json_string = json.dumps(book_dict)
    return json_string


def add_new_item(obj):
    session.add(obj)
    session.commit()


def check_if_user_exist(nickname: str):
    user = session.query(User).where(User.nickname == nickname).first
    return user


def get_book_by(date):
    events = session.query(Book).filter(Book.date == date, Book.user == 1).all()
    jsonified_events = []
    for event in events:
        jsonified_events.append(create_json_from(event))
    return jsonified_events


def delete_user(nickname):
    session.query(User).filter(User.nickname == nickname).delete()
