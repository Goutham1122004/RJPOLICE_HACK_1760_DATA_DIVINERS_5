import streamlit as st
import streamlit.components.v1 as com
from streamlit_option_menu import option_menu
import json
import matplotlib.pyplot as plt
from datetime import datetime
import matplotlib.dates as mdates
import pandas as pd
import altair as alt
import webbrowser
from urllib.parse import quote
import os
import requests

def local_css(file_name):
    with open(file_name) as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

def remote_css(url):
    st.markdown(f'<link href="{url}" rel="stylesheet">', unsafe_allow_html=True)    

def icon(icon_name):
    st.markdown(f'<i class="material-icons">{icon_name}</i>', unsafe_allow_html=True)

local_css("style.css")
remote_css('https://fonts.googleapis.com/icon?family=Material+Icons')
remote_css('https://fonts.googleapis.com/css?family=Inconsolata')


with st.sidebar:
	selected_menu = option_menu(
		menu_title =None,
		options = ["Domain Reputation scan","Domain Advanced scan","Email Reputation scan","IOC Data"],
		icons=["x-diamond","x-diamond-fill","x-diamond","x-diamond-fill"]
		)

if selected_menu == "Domain Reputation scan":

	icon("search")
	st.title("Domain reputation scanner")
	selected = st.text_input("", "")
	button_clicked = st.button("Search")

	if button_clicked:

		import requests

		burp0_url = "https://tranco-list.eu:443/api/ranks/domain/"+selected
		burp0_cookies = {"ext_name": "ojplmecpdpgccookcobabopnaifgidhf"}
		burp0_headers = {"Sec-Ch-Ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"", "Accept": "*/*", "X-Requested-With": "XMLHttpRequest", "Sec-Ch-Ua-Mobile": "?0", "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", "Sec-Ch-Ua-Platform": "\"macOS\"", "Sec-Fetch-Site": "same-origin", "Sec-Fetch-Mode": "cors", "Sec-Fetch-Dest": "empty", "Referer": "https://tranco-list.eu/query", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8", "Connection": "close"}
		data1=requests.get(burp0_url, headers=burp0_headers, cookies=burp0_cookies)
		data = json.loads(data1.content)
		df = pd.DataFrame(data["ranks"])
		def create_chart():
			chart = alt.Chart(df).mark_line().encode(
	        	x="date:T",
	        	y="rank:Q",
				tooltip=["date:T", "rank:Q"]
				).properties(width=600, height=300)

			return chart

	# Streamlit UI
		st.title("Reputation Rank")
		try:
			st.subheader(f"Domain: {data['domain']}\n Rank: {data['ranks'][0]['rank']}")
		except:
			st.subheader(data)
			st.subheader("Unranked,Please check the CyberGordon Data")

	# Display the chart
		st.altair_chart(create_chart(), use_container_width=True)
		st.title("Json data")
		st.write(data1.content)

		burp0_url = "https://cybergordon.com:443/request/form"
		burp0_cookies = {"ext_name": "ojplmecpdpgccookcobabopnaifgidhf", "new_request": "true"}
		burp0_headers = {"Cache-Control": "max-age=0", "Sec-Ch-Ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"", "Sec-Ch-Ua-Mobile": "?0", "Sec-Ch-Ua-Platform": "\"macOS\"", "Upgrade-Insecure-Requests": "1", "Origin": "https://cybergordon.com", "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7", "Sec-Fetch-Site": "same-origin", "Sec-Fetch-Mode": "navigate", "Sec-Fetch-User": "?1", "Sec-Fetch-Dest": "document", "Referer": "https://cybergordon.com/", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8", "Connection": "close"}
		burp0_data = {"obs": selected+"\r\n"}
		data=requests.post(burp0_url, headers=burp0_headers, cookies=burp0_cookies, data=burp0_data)
		st.subheader("Reputation check using CyberGordon")
		st.write(data.url)


if selected_menu == "Domain Advanced scan":
	icon("search")
	st.title("Domain Advanced scanner")
	selected = st.text_input("", "")
	button_clicked = st.button("Search")

	if button_clicked:
		url_data=quote(selected, safe='')
		webbrowser.open("https://datadiviners-webcheck.netlify.app/results/"+url_data)


if selected_menu == "Email Reputation scan":
	icon("search")
	st.title("Email reputation scan")
	selected = st.text_input("", "")
	button_clicked = st.button("Search")

	if button_clicked:
		
		result = os.popen("curl -s emailrep.io/"+selected).read()
		data = json.loads(result)

		# Display email and reputation
		st.title("Email Reputation Report")
		st.subheader(f"Email: {data['email']}")
		st.subheader(f"Reputation: {data['reputation']}")
		
		# Display details
		st.header("Details")
		st.subheader("General Information")
		st.write(f"References: {data['references']}")
		st.write(f"Suspicious: {data['suspicious']}")
		
		st.subheader("Domain Details")
		st.write(f"Domain Reputation: {data['details']['domain_reputation']}")
		st.write(f"First Seen: {data['details']['first_seen']}")
		st.write(f"Last Seen: {data['details']['last_seen']}")
		st.write(f"Days Since Domain Creation: {data['details']['days_since_domain_creation']}")
		
		# Visualization
		#st.header("Graphs")
		
		trust_factors = {
    	"Blacklisted": not data['details']['blacklisted'],
    	"Malicious Activity": not data['details']['malicious_activity'],
    	"Credentials Leaked": not data['details']['credentials_leaked'],
    	"Data Breach": not data['details']['data_breach'],
    	"Reputation": data['reputation'],
    	"Suspicious": not data['suspicious']
		}

		trust_df = pd.DataFrame.from_dict(trust_factors, orient='index', columns=['Trust'])
		trust_df.reset_index(inplace=True)
		trust_df = trust_df.rename(columns={'index': 'Factor'})

		# Visualization
		st.title("Trustability of Email Address")
		st.subheader("Trust Factors")

		# Bar chart for trust factors
		trust_chart = alt.Chart(trust_df).mark_bar().encode(
    		x=alt.X('Factor:N', title='Trust Factor'),
    		y=alt.Y('Trust:O', title='Trustability'),
    		color='Factor:N'
		).properties(title='Trustability Based on Factors')

		st.altair_chart(trust_chart, use_container_width=True)

		
		# You can add more charts based on your specific data and visualization needs
		
		# Display JSON data
		st.header("Raw JSON Data")
		st.json(data)

if selected_menu == "IOC Data":
		url = "https://threatfox-api.abuse.ch/api/v1/"
		headers = {"Content-Type": "application/json"}

		payload = {
    		"query": "get_iocs",
    		"days": 7
		}
		response = requests.post(url, json=payload, headers=headers)
		data=json.loads(response.content)
		st.write(data)
		# data = pd.json_normalize(pd.read_json(data)['data'])

		# response = requests.post(url, json=payload, headers=headers)
		# # Display information
		# st.title("Threat Intelligence Information")
		# for index, row in data.iterrows():
		# 	st.subheader(f"Threat Information #{row['id']}")
		# 	st.write(f"**IOC:** {row['ioc']}")
		# 	st.write(f"**Threat Type:** {row['threat_type_desc']}")
		# 	st.write(f"**IOC Type:** {row['ioc_type_desc']}")
		# 	st.write(f"**Malware:** {row['malware_printable']}")
		# 	st.write(f"**Confidence Level:** {row['confidence_level']}")
		# 	st.write(f"**First Seen:** {row['first_seen']}")
		# 	st.write(f"**Reporter:** {row['reporter']}")
		# 	st.write(f"**Reference:** [Link]({row['reference']})")
		# 	st.write(f"**Tags:** {', '.join(row['tags'])}")
		# 	st.markdown('---')
