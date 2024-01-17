
import base64
from datetime import datetime

import openai
import pymongo
from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)

# myclient = pymongo.MongoClient("mongodb+srv://maginesh:Zone7@cluster0.mjduete.mongodb.net/?retryWrites=true&w=majority")
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["Departments"]
openai.api_key = "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"


@app.route('/')
def index():
    return 'Hello, this is the root route!'



@app.route('/submit', methods=['POST'])
def submit_grievance():
    data = request.json
    
    image_data = base64.b64decode(data.get('fileUpload', ''))

    mycol = mydb["GrievanceNew"]
    grievance_data = {
        "userid":data['userid'],
        "name": data['name'],
        "gender":data['gender'],
        "country":data['country'],
        "state":data['state'],
        "district":data['district'],
        "address": data['address'],
        "locality":data['locality'],
        "pincode":data['pincode'],
        "mobile":data['mobile'],
        "email":data['email'],
        "complaintno": data["complaintNo"],
        "minstate":data["minstate"],
        "department":data['department'],
        "refno":data['refno'],
        "refdate":data['refdate'],
        "date": datetime.now().strftime("%Y-%m-%d"),
        "time": datetime.now().strftime("%H-%M-%S"),
        "grievance": data['grievance'],
        "status":"Accepted",
        "priority":data['priority'],
        "statusdate":datetime.now().strftime("%Y-%m-%d"),
        "statustime":datetime.now().strftime("%H-%M-%S"),
        "Attach": image_data
    }
    result = mycol.insert_one(grievance_data)

    return jsonify({"status": "success", "message": "Grievance submitted successfully", "id": str(result.inserted_id)})

@app.route('/submitlabour', methods=['POST'])
def submitlabour_grievance():
    data = request.json 
    
    image_data = base64.b64decode(data.get('fileUpload', ''))

    mycol = mydb["Labour and Employment"]
    grievance_data = {
        "userid":data['userid'],
        "name": data['name'],
        "address": data['address'],
        "locality":data['locality'],
        "mobile":data['mobile'],
        "gender":data['gender'],
        "country":data['country'],
        "state":data['state'],
        "department":data['department'],
        "complaintno": data["complaintNo"],
        "maincategory": data["mainCategory"],
        "nextcategory": data["nextCategory"],
        "ipno": data["ipno"],
        "boname": data["boname"],
        "roname": data["roname"],
        "date": datetime.now().strftime("%Y-%m-%d"),
        "time": datetime.now().strftime("%H-%M-%S"),
        "grievance": data["grievance"],
        "status":"Accepted",
        "Attach": image_data
    }
    result = mycol.insert_one(grievance_data)

    return jsonify({"status": "success", "message": "Grievance submitted successfully", "id": str(result.inserted_id)})


@app.route('/submitincome', methods=['POST'])
def submitincome_grievance():
    data = request.json 
    
    image_data = base64.b64decode(data.get('fileUpload', ''))

    mycol = mydb["Central board of Direct Tax"]
    grievance_data = {
        "userid":data['userid'],
        "name": data['name'],
        "address": data['address'],
        "locality":data['locality'],
        "mobile":data['mobile'],
        "gender":data['gender'],
        "country":data['country'],
        "state":data['state'],
        "department":data['department'],
        "complaintno": data["complaintNo"],
        "maincategory": data["mainCategory"],
        "nextcategory": data["nextCategory"],
        "orname": data["orname"],
        "division": data["division"],
        "empname": data["empname"],
        "office": data["office"],
        "date": datetime.now().strftime("%Y-%m-%d"),
        "time": datetime.now().strftime("%H-%M-%S"),
        "grievance": data["grievance"],
        "status":"Accepted",
        "statusdate":datetime.now().strftime("%Y-%m-%d"),
        "statustime":datetime.now().strftime("%H-%M-%S"),
        "Attach": image_data
    }
    result = mycol.insert_one(grievance_data)

    return jsonify({"status": "success", "message": "Grievance submitted successfully", "id": str(result.inserted_id)})


@app.route('/grievance/delete/<collection_name>/<complaintno>', methods=['DELETE'])
def delete_complaint_from_collection(collection_name, complaintno):
    try:
        current_collection = mydb[collection_name]
        
        result = current_collection.delete_one({"complaintno": complaintno})

        if result.deleted_count > 0:
            return jsonify({'message': 'Complaint deleted successfully'}), 200
        else:
            return jsonify({'message': f'Complaint not found in collection {collection_name}'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@app.route('/grievance/insertreroute/<collection_name>', methods=['POST'])
def insert_reroute(collection_name):
    try:
        data = request.json

        current_collection = mydb[collection_name]
        grievance_data = {
            "userid": data['userid'],
            "routeid":data['routeid'],
            "complaintNo": data['complaintNo'],
            "routedfromdept": data['currentdept'],
            "routedtodept": data['routedto'],
            "date": datetime.now().strftime("%Y-%m-%d"),
            "time": datetime.now().strftime("%H-%M-%S")
        }
        result = current_collection.insert_one(grievance_data)

        return jsonify({"status": "success", "message": "Grievance submitted successfully", "id": str(result.inserted_id)})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/insertnotification/<collection_name>', methods=['POST'])
def insert_notification(collection_name):
    try:
        data = request.json

        current_collection = mydb[collection_name]
        grievance_data = {
            "userid": data['userid'],
            "notification": data['notification']
        }
        result = current_collection.insert_one(grievance_data)

        return jsonify({"status": "success", "message": "Grievance submitted successfully", "id": str(result.inserted_id)})

    except Exception as e:
        return jsonify({'error': str(e)}), 500





@app.route('/grievance/count/<int:target_id>', methods=['GET'])
def get_usergrievance_count(target_id):
    counts = {"inprogress": 0, "solved": 0, "accepted": 0, "rejected":0}
    collection_names = ["Grievances"]
    for collection_name in collection_names:
        collection = mydb[collection_name]
        counts["inprogress"] += collection.count_documents({"userid": target_id, "status": "InProgress"})
        counts["solved"] += collection.count_documents({"userid": target_id, "status": "Solved"})
        counts["accepted"] += collection.count_documents({"userid": target_id, "status": "Accepted"})
        counts["rejected"] += collection.count_documents({"userid": target_id, "status": "Rejected"})

    return jsonify(counts)


@app.route('/grievance/deptdetailscount/<string:target_deptcount>', methods=['GET'])
def get_usergrievance_deptdetailscount(target_deptcount):
    counts = {"inprogress": 0, "solved": 0, "accepted": 0, "rejected": 0}
    collection_names = ["Grievances"]

    for collection_name in collection_names:
        collection = mydb[collection_name]
        counts["inprogress"] += collection.count_documents({"department": target_deptcount, "status": "InProgress"})
        counts["solved"] += collection.count_documents({"department": target_deptcount, "status": "Solved"})
        counts["accepted"] += collection.count_documents({"department": target_deptcount, "status": "Accepted"})
        counts["rejected"] += collection.count_documents({"department": target_deptcount, "status": "Rejected"})

    return jsonify(counts)


@app.route('/grievance/countcomplaint', methods=['GET'])
def get_usergrievance_countcomplaint():
    counts = {"inprogress": 0, "solved": 0, "accepted": 0, "rejected":0}
    collection_names = ["Grievances"]
    for collection_name in collection_names:
        collection = mydb[collection_name]
        counts["inprogress"] += collection.count_documents({"status": "InProgress"})
        counts["solved"] += collection.count_documents({"status": "Solved"})
        counts["accepted"] += collection.count_documents({"status": "Accepted"})
        counts["rejected"] += collection.count_documents({"status": "Rejected"})

    return jsonify(counts)

@app.route('/grievance/data/<int:target_id>', methods=['GET'])
def get_grievance_data(target_id):
    grievances = []

    collection_names = ["Grievances"]

    for collection_name in collection_names:
        collection = mydb[collection_name]
        cursor = collection.find({"userid": target_id})
        for document in cursor:
            grievance_data = {
                "_id": str(document["_id"]),
                "complaintno": document.get("complaintno", ""),
                "date": document.get("date", ""),
                "department": document.get("department", ""),
                "grievance": document.get("grievance", ""),
                "status": document.get("status", "")
            }
            grievances.append(grievance_data)

    return jsonify(grievances)


@app.route('/chatbotuser/<int:target_id>', methods=['GET'])
def get_chatbotuser(target_id):
    grievances = []

    collection_names = ["Details"]

    for collection_name in collection_names:
        collection = mydb[collection_name]
        cursor = collection.find({"userid": target_id})
        for document in cursor:
            grievance_data = {
                "_id": str(document["_id"]),
                "userid": document.get("userid", ""),
                "state": document.get("state", ""),
                "pincode": document.get("pincode", "")
            }
            grievances.append(grievance_data)

    return jsonify(grievances)


from flask import jsonify


@app.route('/chatbotstatus/<int:target_id>', methods=['GET'])
def get_chatbotstatus(target_id):
    grievances = []

    collection_names = ["Grievances"]

    for collection_name in collection_names:
        collection = mydb[collection_name]
        cursor = collection.find({"userid": target_id})
        for document in cursor:
            grievance_data = {
                "_id": str(document["_id"]),
                "complaintno": document.get("complaintno", ""),
            }
            grievances.append(grievance_data)

    complaint_numbers = [grievance['complaintno'] for grievance in grievances]

    return jsonify(complaint_numbers)






@app.route('/notification/data/<int:target_id>', methods=['GET'])
def get_notification_data(target_id):
    grievances = []

    collection_names = ["Notifications"]

    for collection_name in collection_names:
        collection = mydb[collection_name]
        cursor = collection.find({"userid": target_id})
        for document in cursor:
            grievance_data = {
                "_id": str(document["_id"]),
                "notification": document.get("notification", "")
            }
            grievances.append(grievance_data)

    return jsonify(grievances)


@app.route('/routedetails/<string:target_rid>/<int:target_uid>', methods=['GET'])
def get_routedetails(target_rid,target_uid):
    routedetails = []

    collection_names = ["Grievances"]
    for collection_name in collection_names:
        collection = mydb[collection_name]
        cursor = collection.find({"complaintno": target_rid,"userid":target_uid})
        for document in cursor:
            grievance_data = {
                "_id": str(document["_id"]),
                "userid": document.get("userid", ""),
                "complaintno":document.get("complaintno"),
                "date": document.get("date", ""),
                "time":document.get("time","")
            }
            routedetails.append(grievance_data)
    return jsonify(routedetails)


@app.route('/grievance/adminpending/<string:target_status>', methods=['GET'])
def get_grievance_adminpending(target_status):
    grievances = []

    collection_names = ["Grievances"]

    for collection_name in collection_names:
        collection = mydb[collection_name]
        cursor = collection.find({"status": target_status})
        for document in cursor:
            grievance_data = {
                "_id": str(document["_id"]),
                "complaintno": document.get("complaintno", ""),
                "date": document.get("date", ""),
                "department": document.get("department", ""),
                "grievance": document.get("grievance", ""),
                "status": document.get("status", "")
            }
            grievances.append(grievance_data)

    return jsonify(grievances)

@app.route('/grievance/deptpending/<string:target_status>/<string:target_dept>', methods=['GET'])
def get_grievance_deptpending(target_status,target_dept):
    grievances = []

    collection_names = ["Grievances"]

    for collection_name in collection_names:
        collection = mydb[collection_name]
        cursor = collection.find({"status": target_status,"department": target_dept})
        for document in cursor:
            grievance_data = {
                "_id": str(document["_id"]),
                "complaintno": document.get("complaintno", ""),
                "date": document.get("date", ""),
                "department": document.get("department", ""),
                "grievance": document.get("grievance", ""),
                "status": document.get("status", "")
            }
            grievances.append(grievance_data)

    return jsonify(grievances)



@app.route('/grievance/admindata', methods=['GET'])
def get_grievance_admindata():
    grievances = []

    collection_names = ["Grievances"]

    for collection_name in collection_names:
        collection = mydb[collection_name]
        cursor = collection.find()
        for document in cursor:
            grievance_data = {
                "_id": str(document["_id"]),
                "complaintno": document.get("complaintno", ""),
                "date": document.get("date", ""),
                "department": document.get("department", ""),
                "grievance": document.get("grievance", ""),
                "status": document.get("status", "")
            }
            grievances.append(grievance_data)

    return jsonify(grievances)


@app.route('/grievance/deptdata/<string:dept_name>', methods=['GET'])
def get_grievance_deptdata(dept_name):
    grievances = []

    collection_names = ["Grievances"]

    for collection_name in collection_names:
        collection = mydb[collection_name]
        cursor = collection.find({"department":dept_name})
        for document in cursor:
            grievance_data = {
                "_id": str(document["_id"]),
                "complaintno": document.get("complaintno", ""),
                "date": document.get("date", ""),
                "department": document.get("department", ""),
                "grievance": document.get("grievance", ""),
                "status": document.get("status", "")
            }
            grievances.append(grievance_data)

    return jsonify(grievances)

from datetime import datetime

from flask import jsonify, request


@app.route('/grievance/updateStatus/<complaintno>', methods=['PUT'])
def update_status(complaintno):
    try:
        data = request.json  
        new_status = data.get('status')

        print(f"Updating status for complaint number: {complaintno} to status: {new_status}")

        collection_names = ["Grievances"]
        found_in_any_collection = False

        for collection_name in collection_names:
            collection = mydb[collection_name]
            result = collection.update_one(
                {'complaintno': complaintno},
                {
                    '$set': {
                        'status': new_status,
                        'statusdate': datetime.now().strftime("%Y-%m-%d"),
                        'statustime': datetime.now().strftime("%H-%M-%S")
                    }
                }
            )

            if result.modified_count > 0:
                found_in_any_collection = True
                break

        if found_in_any_collection:
            return jsonify({'message': 'Status updated successfully'}), 200
        else:
            return jsonify({'message': 'No matching complaint found in any collection'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    

@app.route('/grievance/routedept/<complaintno>', methods=['PUT'])
def update_routedept(complaintno):
    try:
        data = request.json  
        new_dept = data.get('department')

        print(f"Updating dept for complaint number: {complaintno} to status: {new_dept}")

        collection_names = ["Grievances"]
        found_in_any_collection = False

        for collection_name in collection_names:
            collection = mydb[collection_name]
            result = collection.update_one(
                {'complaintno': complaintno},
                {'$set': {'department': new_dept}}
            )

            if result.modified_count > 0:
                found_in_any_collection = True
                break

        if found_in_any_collection:
            return jsonify({'message': 'Dept updated successfully'}), 200
        else:
            return jsonify({'message': 'No matching complaint found in any collection'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/grievance/details/<complaintno>', methods=['GET'])
def get_grievance_details(complaintno):
    details = []
    collection_names = mydb.list_collection_names()

    for collection_name in collection_names:
        collection = mydb[collection_name]
        cursor = collection.find({"complaintno": complaintno})

        for document in cursor:
            # attach_data = base64.b64encode(document.get("Attach", b"")).decode("utf-8")
            details_data = {
                "_id": str(document["_id"]),
                "userid":document.get("userid",""),
                "name": document.get("name", ""),
                "gender": document.get("gender", ""),
                "country": document.get("country", ""),
                "state": document.get("state", ""),
                "district": document.get("district", ""),
                "address": document.get("address", ""),
                "locality": document.get("locality", ""),
                "pincode":document.get("pincode",""),
                "mobile": document.get("mobile", ""),
                "email": document.get("email", ""),
                "complaintNo": document.get("complaintno", ""),
                "minstate":document.get("minstate",""),
                "department": document.get("department", ""),
                "date": document.get("date", ""),
                "time": document.get("time", ""),
                "grievance": document.get("grievance", ""),
                "status": document.get("status", ""),
                "Attach": base64.b64encode(document.get("Attach", b"")).decode("utf-8") if document.get("Attach") else '',
                # "Attach": attach_data,
            }
            details.append(details_data)

    print("Details:", details)
    return jsonify(details)




if __name__ == '__main__':
    app.run(debug=True)