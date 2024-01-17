import requests

# ClearoutPhone API endpoint for phone number validation
validate_url = "https://api.clearoutphone.io/v1/phonenumber/validate"
payload = '{"number": "9600673764", "country_code": "IN"}'
headers = {
    'Content-Type': "application/json",
    'Authorization': "Bearer:3b86479a39df94f114b3ec0117f264f8:a9dcbe3e3ca42715b32835412b1028e4d8a1dca98b1704669aa7bb7b161f1e4a",
}
response = requests.post(validate_url, data=payload, headers=headers)
validation_result = response.json()

# Printing validation results
print('Validation Result:')
print(f"Status: {validation_result['data']['status']}")
print(f"Line Type: {validation_result['data']['line_type']}")
print(f"Carrier: {validation_result['data']['carrier']}")
print(f"Location: {validation_result['data']['location']}")
# Add more fields as needed

# ClearoutPhone API endpoint for getting credit information
credit_url = "https://api.clearoutphone.io/v1/phonenumber/getcredit"
credit_response = requests.get(credit_url, headers=headers)
credit_info = credit_response.json()

# Printing credit information with error handling
print('\nCredit Information:')
if 'data' in credit_info:
    print(f"Status: {credit_info['status']}")
    print(f"Credit Balance: {credit_info['data'].get('balance', 'N/A')}")
    # Add more fields as needed
else:
    print(f"Error: {credit_info.get('error', 'Unknown error')}")
