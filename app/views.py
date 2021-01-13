from app import app, search_engine
from flask import render_template, request, jsonify


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/search", methods=["POST"])
def search():

    data = request.get_data().decode("utf-8").lower()
    if data:
        data = search_engine.find_matches(data)
        return jsonify(data)
    else:
        return jsonify([])


@app.route("/result", methods=["POST"])
def result():

    data = request.get_data().decode("utf-8").lower()

    if data and data != "":
        result_data = search_engine.get_description(data)

        if result_data:
            return jsonify([result_data[0], result_data[1]])

        else:
            return jsonify(data, "aradığınız terim sözlükte bulunmuyor.", 2)

    else:  
        return jsonify([data, "aramadan önce bir şeyler yazın."])
