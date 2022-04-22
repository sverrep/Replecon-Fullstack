import vakt
import uuid
from sqlalchemy import create_engine, false, true
from sqlalchemy.orm import sessionmaker, scoped_session
from vakt.storage.sql import SQLStorage
from vakt.storage.sql.model import Base
from vakt.rules import Eq, Any, StartsWith, NotEq, CIDR, And, Greater, Less, In
import logging


engine = create_engine('mysql://root:12345@localhost:3306/prismadb')
Base.metadata.create_all(engine)
session = scoped_session(sessionmaker(bind=engine))
storage = SQLStorage(scoped_session= session)

guard = vakt.Guard(storage, vakt.RulesChecker())


root = logging.getLogger()
root.setLevel(logging.DEBUG)
root.addHandler(logging.StreamHandler())



def checkInq(action, resource, subject, context):
    inq = vakt.Inquiry(action=action, resource=resource, subject=subject, context=context)
    print(inq)
    try:
        assert guard.is_allowed(inq)
        return True
    except AssertionError:
        logging.error("Help at inquiry")
        return False

def createPolicies():
    policies = [
        vakt.Policy(
            str(uuid.uuid4()),
            description="Can only create a new class if Teacher",
            actions=[Eq('POST')],
            resources=[Eq('classroom')],
            subjects=[Eq('Teacher')],
            effect=vakt.ALLOW_ACCESS,
            context={'CSRF': CIDR('127.0.0.1/32')}
        ),
        vakt.Policy(
            str(uuid.uuid4()),
            description="Everyone can read classes",
            actions=[Eq('GET')],
            resources=[Eq('classroom')],
            subjects=[Any()],
            effect=vakt.ALLOW_ACCESS,
            context={'CSRF': CIDR('127.0.0.1/32')}
        ),
        vakt.Policy(
            str(uuid.uuid4()),
            description="Testing policies 2 with Vakt",
            actions=[Eq('GET'), Eq('POST'), Eq('DELETE')],
            resources=[Eq('classroom')],
            subjects=[Eq('Teacher')],
            effect=vakt.ALLOW_ACCESS,
            context={'CSRF': CIDR('127.0.0.1/32')}
        ),
    ]
    for policy in policies:
        print("yo")
        storage.add(policy)

#createPolicies()