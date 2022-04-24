import vakt
import uuid
from sqlalchemy import create_engine, false, true
from sqlalchemy.orm import sessionmaker, scoped_session
from vakt.storage.sql import SQLStorage
from vakt.storage.sql.model import Base
from vakt.rules import Eq, Any, StartsWith, NotEq, CIDR, And, Greater, Less, In
import logging


engine = create_engine('mysql://root:12345@localhost:3306/replecondb')
Base.metadata.create_all(engine)
session = scoped_session(sessionmaker(bind=engine))
storage = SQLStorage(scoped_session= session)

guard = vakt.Guard(storage, vakt.RulesChecker())


root = logging.getLogger()
root.setLevel(logging.DEBUG)
root.addHandler(logging.StreamHandler())



def checkInq(action, resource, subject):
    inq = vakt.Inquiry(action=action, resource=resource, subject=subject)
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
            description="GET Permissions based on teacher attribute / role",
            actions=[Eq('GET')],
            resources=[Eq('classroom'), Eq('bank'), Eq('store'), Eq('tax'), Eq('transaction'), Eq('users'), Eq('transactionintrest'), Eq('transactionintrestpayout'), Eq('transactions')],
            subjects=[Eq('Teacher')],
            effect=vakt.ALLOW_ACCESS,
        ),
        vakt.Policy(
            str(uuid.uuid4()),
            description="POST Permissions based on teacher attribute / role",
            actions=[Eq('POST')],
            resources=[Eq('classroom'), Eq('bank'), Eq('store'), Eq('tax'), Eq('users'), Eq('transactions')],
            subjects=[Eq('Teacher')],
            effect=vakt.ALLOW_ACCESS,
        ),
        vakt.Policy(
            str(uuid.uuid4()),
            description="PUT Permissions based on teacher attribute / role",
            actions=[Eq('PUT')],
            resources=[Eq('classroom'), Eq('bank'), Eq('store'), Eq('tax'), Eq('users')],
            subjects=[Eq('Teacher')],
            effect=vakt.ALLOW_ACCESS,
        ),
        vakt.Policy(
            str(uuid.uuid4()),
            description="DELETE Permissions based on teacher attribute / role",
            actions=[Eq('DELETE')],
            resources=[Eq('classroom'), Eq('store'), Eq('tax'), Eq('users'), Eq('transactionintrest')],
            subjects=[Eq('Teacher')],
            effect=vakt.ALLOW_ACCESS,
        ),
        vakt.Policy(
            str(uuid.uuid4()),
            description="GET Permissions based on student attribute / role",
            actions=[Eq('GET')],
            resources=[Eq('classroom'), Eq('bank'), Eq('transactionintrest'), Eq('transactionintrestpayout'), Eq('transactions')],
            subjects=[Eq('Student')],
            effect=vakt.ALLOW_ACCESS,
        ),
        vakt.Policy(
            str(uuid.uuid4()),
            description="POST Permissions based on student attribute / role",
            actions=[Eq('POST')],
            resources=[Eq('transactionintrest'), Eq('transactions')],
            subjects=[Eq('Student')],
            effect=vakt.ALLOW_ACCESS,
        ),
        vakt.Policy(
            str(uuid.uuid4()),
            description="PUT Permissions based on student attribute / role",
            actions=[Eq('PUT')],
            resources=[Eq('transactionintrest')],
            subjects=[Eq('Student')],
            effect=vakt.ALLOW_ACCESS,
        ),
        vakt.Policy(
            str(uuid.uuid4()),
            description="DELETE Permissions based on student attribute / role",
            actions=[Eq('DELETE')],
            resources=[],
            subjects=[Eq('Student')],
            effect=vakt.ALLOW_ACCESS,
        ),
        vakt.Policy(
            str(uuid.uuid4()),
            description="Permissions allowed to anyone",
            actions=[Eq('GET')],
            resources=[Eq('login'), Eq('signup')],
            subjects=[Any()],
            effect=vakt.ALLOW_ACCESS,
        ),

    ]
    for policy in policies:
        storage.add(policy)

#createPolicies()