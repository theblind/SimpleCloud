/*针对阿里云，用于获取各种格式的请求数据，以及相应的返回数据*/
/*数据获取自 http://buy.aliyun.com/vm?spm=5176.6969525.1996018689.1.lzhQME */
var dataList = [
	{
		remark: "wwww",
		base64Data: "W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMjU2MCIsInZtX2JhbmR3aWR0aCI6IjMwNzIiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV9vcyI6IiIsInZtX2Rpc2siOltdLCJkdXJhdGlvbiI6IjciLCJwcmljaW5nX2N5Y2xlIjoibW9udGgiLCJxdWFudGl0eSI6IjEiLCJ2bV95dW5kdW5fbW9uaXRvciI6IjEiLCJ2bV95dW5kdW5fc2VydmljZSI6IjEifX1d",
		postData: "[]",
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":1953.00,"ruleIds":[],"settleType":"PREPAY","tradeAmount":1953.00},"rules":[]},"success":true}',
	},
	{
		remark: "wwww",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMjU2MCIsInZtX2JhbmR3aWR0aCI6IjMwNzIiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV9vcyI6IiIsInZtX2Rpc2siOlt7InR5cGUiOiJ2bV95dW5kaXNrX3N0b3JhZ2UiLCJzaXplIjoiMTQ4Iiwidm1fc25hcHNob3RfaWQiOm51bGx9XSwiZHVyYXRpb24iOiI3IiwicHJpY2luZ19jeWNsZSI6Im1vbnRoIiwicXVhbnRpdHkiOiIxIiwidm1feXVuZHVuX21vbml0b3IiOiIxIiwidm1feXVuZHVuX3NlcnZpY2UiOiIxIn19XQ==',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":2325.96,"ruleIds":[],"settleType":"PREPAY","tradeAmount":2325.96},"rules":[]},"success":true}'
	},
	{
		remark: "wwww",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMjU2MCIsInZtX2JhbmR3aWR0aCI6IjE0MzM2Iiwidm1fcmVnaW9uX25vIjoiY24tcWluZ2Rhby1jbTUtYTAxIiwidm1fb3MiOiIiLCJ2bV9kaXNrIjpbeyJ0eXBlIjoidm1feXVuZGlza19zdG9yYWdlIiwic2l6ZSI6IjQ1MCIsInZtX3NuYXBzaG90X2lkIjpudWxsfV0sImR1cmF0aW9uIjoiNyIsInByaWNpbmdfY3ljbGUiOiJtb250aCIsInF1YW50aXR5IjoiMSIsInZtX3l1bmR1bl9tb25pdG9yIjoiMSIsInZtX3l1bmR1bl9zZXJ2aWNlIjoiMSJ9fV0=',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":9765.00,"ruleIds":[],"settleType":"PREPAY","tradeAmount":9765.00},"rules":[]},"success":true}'
	},
	{
		remark: "wwww",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMjU2MCIsInZtX2JhbmR3aWR0aCI6IjE0MzM2Iiwidm1fcmVnaW9uX25vIjoiY24tcWluZ2Rhby1jbTUtYTAxIiwidm1fb3MiOiIiLCJ2bV9kaXNrIjpbeyJ0eXBlIjoidm1feXVuZGlza19zdG9yYWdlIiwic2l6ZSI6IjQ1MCIsInZtX3NuYXBzaG90X2lkIjpudWxsfV0sImR1cmF0aW9uIjoiNyIsInByaWNpbmdfY3ljbGUiOiJtb250aCIsInF1YW50aXR5IjoiMiIsInZtX3l1bmR1bl9tb25pdG9yIjoiMSIsInZtX3l1bmR1bl9zZXJ2aWNlIjoiMSJ9fV0=',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":19530.00,"ruleIds":[],"settleType":"PREPAY","tradeAmount":19530.00},"rules":[]},"success":true}'
	},
	{
		remark: "wwww",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMjU2MCIsInZtX2JhbmR3aWR0aCI6IjE0MzM2Iiwidm1fcmVnaW9uX25vIjoiY24tcWluZ2Rhby1jbTUtYTAxIiwidm1fb3MiOiJ3aW4yMDAzXzY0X3N0YW5kX3IyX2VuXzQwR19hbGliYXNlX3YwMS52aGQiLCJ2bV9kaXNrIjpbeyJ0eXBlIjoidm1feXVuZGlza19zdG9yYWdlIiwic2l6ZSI6IjQ1MCIsInZtX3NuYXBzaG90X2lkIjpudWxsfV0sImR1cmF0aW9uIjoiNyIsInByaWNpbmdfY3ljbGUiOiJtb250aCIsInF1YW50aXR5IjoiMSIsInZtX3l1bmR1bl9tb25pdG9yIjoiMSIsInZtX3l1bmR1bl9zZXJ2aWNlIjoiMSJ9fV0=',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":9765.00,"ruleIds":[],"settleType":"PREPAY","tradeAmount":9765.00},"rules":[]},"success":true}'
	},
	{
		remark: "wwww",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiI0Iiwidm1fcmFtIjoiNDA5NiIsInZtX2JhbmR3aWR0aCI6IjE0MzM2Iiwidm1fcmVnaW9uX25vIjoiY24tcWluZ2Rhby1jbTUtYTAxIiwidm1fb3MiOiJ3aW4yMDAzXzY0X3N0YW5kX3IyX2VuXzQwR19hbGliYXNlX3YwMS52aGQiLCJ2bV9kaXNrIjpbXSwiZHVyYXRpb24iOiI3IiwicHJpY2luZ19jeWNsZSI6Im1vbnRoIiwicXVhbnRpdHkiOiIxIiwidm1feXVuZHVuX21vbml0b3IiOiIxIiwidm1feXVuZHVuX3NlcnZpY2UiOiIxIn19XQ==',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":9779.00,"ruleIds":[],"settleType":"PREPAY","tradeAmount":9779.00},"rules":[]},"success":true}'
	},
	{
		remark: "wwww",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiI0Iiwidm1fcmFtIjoiNDA5NiIsInZtX2JhbmR3aWR0aCI6IjE0MzM2Iiwidm1fcmVnaW9uX25vIjoiY24tcWluZ2Rhby1jbTUtYTAxIiwidm1fb3MiOiJ3aW4yMDAzXzY0X3N0YW5kX3IyX2VuXzQwR19hbGliYXNlX3YwMS52aGQiLCJ2bV9kaXNrIjpbeyJ0eXBlIjoidm1feXVuZGlza19zdG9yYWdlIiwic2l6ZSI6Ijc0MCIsInZtX3NuYXBzaG90X2lkIjpudWxsfV0sImR1cmF0aW9uIjoiNyIsInByaWNpbmdfY3ljbGUiOiJtb250aCIsInF1YW50aXR5IjoiMSIsInZtX3l1bmR1bl9tb25pdG9yIjoiMSIsInZtX3l1bmR1bl9zZXJ2aWNlIjoiMSJ9fV0=',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":11643.80,"ruleIds":[],"settleType":"PREPAY","tradeAmount":11643.80},"rules":[]},"success":true}'
	},
	{
		remark: "wwww",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiI0Iiwidm1fcmFtIjoiNDA5NiIsInZtX2JhbmR3aWR0aCI6IjE0MzM2Iiwidm1fcmVnaW9uX25vIjoiY24tcWluZ2Rhby1jbTUtYTAxIiwidm1fb3MiOiJkZWJpYW42MDZfNjRfMjBHX2FsaWJhc2VfMjAxMzExMjEudmhkIiwidm1fZGlzayI6W3sidHlwZSI6InZtX3l1bmRpc2tfc3RvcmFnZSIsInNpemUiOiIxMDMiLCJ2bV9zbmFwc2hvdF9pZCI6bnVsbH1dLCJkdXJhdGlvbiI6IjciLCJwcmljaW5nX2N5Y2xlIjoibW9udGgiLCJxdWFudGl0eSI6IjEiLCJ2bV95dW5kdW5fbW9uaXRvciI6IjEiLCJ2bV95dW5kdW5fc2VydmljZSI6IjEifX1d',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":10038.56,"ruleIds":[],"settleType":"PREPAY","tradeAmount":10038.56},"rules":[]},"success":true}'
	},
	{
		remark: "wwww",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiI0Iiwidm1fcmFtIjoiNDA5NiIsInZtX2JhbmR3aWR0aCI6IjE0MzM2Iiwidm1fcmVnaW9uX25vIjoiY24tcWluZ2Rhby1jbTUtYTAxIiwidm1fb3MiOiJkZWJpYW42MDZfNjRfMjBHX2FsaWJhc2VfMjAxMzExMjEudmhkIiwidm1fZGlzayI6W3sidHlwZSI6InZtX3l1bmRpc2tfc3RvcmFnZSIsInNpemUiOiIxMDMiLCJ2bV9zbmFwc2hvdF9pZCI6bnVsbH1dLCJkdXJhdGlvbiI6IjciLCJwcmljaW5nX2N5Y2xlIjoibW9udGgiLCJxdWFudGl0eSI6IjMiLCJ2bV95dW5kdW5fbW9uaXRvciI6IjEiLCJ2bV95dW5kdW5fc2VydmljZSI6IjEifX1d',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":30115.68,"ruleIds":[],"settleType":"PREPAY","tradeAmount":30115.68},"rules":[]},"success":true}'
	},
	{
		remark: "wwww",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiI4Iiwidm1fcmFtIjoiMzI3NjgiLCJ2bV9iYW5kd2lkdGgiOiIzNTg0MCIsInZtX3JlZ2lvbl9ubyI6ImNuLXFpbmdkYW8tY201LWEwMSIsInZtX29zIjoiIiwidm1fZGlzayI6W3sidHlwZSI6InZtX3l1bmRpc2tfc3RvcmFnZSIsInNpemUiOiIxMjMiLCJ2bV9zbmFwc2hvdF9pZCI6bnVsbH1dLCJkdXJhdGlvbiI6IjIiLCJwcmljaW5nX2N5Y2xlIjoieWVhciIsInF1YW50aXR5IjoiMyIsInZtX3l1bmR1bl9tb25pdG9yIjoiMSIsInZtX3l1bmR1bl9zZXJ2aWNlIjoiMSJ9fV0=',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":298696.80,"ruleIds":[],"settleType":"PREPAY","tradeAmount":298696.80},"rules":[]},"success":true}'
	},
	{
		remark: "wwww",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiI4Iiwidm1fcmFtIjoiODE5MiIsInZtX2JhbmR3aWR0aCI6IjM1ODQwIiwidm1fcmVnaW9uX25vIjoiY24tcWluZ2Rhby1jbTUtYTAxIiwidm1fb3MiOiJyaGVsNXU3XzY0XzIwR19hbGliYXNlXzIwMTMxMTIxLnZoZCIsInZtX2Rpc2siOlt7InR5cGUiOiJ2bV95dW5kaXNrX3N0b3JhZ2UiLCJzaXplIjoiNDkiLCJ2bV9zbmFwc2hvdF9pZCI6bnVsbH1dLCJkdXJhdGlvbiI6IjIiLCJwcmljaW5nX2N5Y2xlIjoieWVhciIsInF1YW50aXR5IjoiMSIsInZtX3l1bmR1bl9tb25pdG9yIjoiMSIsInZtX3l1bmR1bl9zZXJ2aWNlIjoiMSJ9fV0=',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":77732.80,"ruleIds":[],"settleType":"PREPAY","tradeAmount":77732.80},"rules":[]},"success":true}'
	},
	{
		remark: "wwww",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6ImVjcyIsImRhdGEiOnsiZHVyYXRpb24iOiIxIiwicHJpY2luZ19jeWNsZSI6ImhvdXIiLCJxdWFudGl0eSI6IjEiLCJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMTUzNiIsInZtX2JhbmR3aWR0aCI6IjUxMjAiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV9vcyI6InVidW50dTEyMDRfNjRfMjBHX2FsaWJhc2VfMjAxMzExMjEudmhkIiwidm1feXVuZHVuX21vbml0b3IiOiIxIiwidm1feXVuZHVuX3NlcnZpY2UiOiIxIiwidm1faXNfZmxvd190eXBlIjoiMSIsInZtX2Rpc2siOlt7InNpemUiOiIyOSIsInR5cGUiOiJ2bV95dW5kaXNrX3N0b3JhZ2UifV0sInZtX2Zsb3dfb3V0IjoiMSJ9fV0=',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":0.51,"ruleIds":[],"settleType":"POSTPAY","tradeAmount":0.51},"rules":[]},"success":true}'
	},
	{
		remark: "wwww",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6ImVjcyIsImRhdGEiOnsiZHVyYXRpb24iOiIxIiwicHJpY2luZ19jeWNsZSI6ImhvdXIiLCJxdWFudGl0eSI6IjEiLCJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMTUzNiIsInZtX2JhbmR3aWR0aCI6IjUxMjAiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV95dW5kdW5fbW9uaXRvciI6IjEiLCJ2bV95dW5kdW5fc2VydmljZSI6IjEiLCJ2bV9pc19mbG93X3R5cGUiOiIxIiwidm1fZGlzayI6W3sic2l6ZSI6IjI5IiwidHlwZSI6InZtX3l1bmRpc2tfc3RvcmFnZSJ9XSwidm1fZmxvd19vdXQiOiIxIn19XQ==',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":0.51,"ruleIds":[],"settleType":"POSTPAY","tradeAmount":0.51},"rules":[]},"success":true}'
	},
	{
		remark: "wwww",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6ImVjcyIsImRhdGEiOnsiZHVyYXRpb24iOiIxIiwicHJpY2luZ19jeWNsZSI6ImhvdXIiLCJxdWFudGl0eSI6IjEiLCJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMTUzNiIsInZtX2JhbmR3aWR0aCI6IjIwNDgiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV9vcyI6IndpbjIwMDNfNjRfc3RhbmRfcjJfY25fNDBHX2FsaWJhc2VfdjAyLnZoZCIsInZtX3l1bmR1bl9tb25pdG9yIjoiMSIsInZtX3l1bmR1bl9zZXJ2aWNlIjoiMSIsInZtX2lzX2Zsb3dfdHlwZSI6IjAiLCJ2bV9kaXNrIjpbeyJzaXplIjoiMjkiLCJ0eXBlIjoidm1feXVuZGlza19zdG9yYWdlIn1dfX1d',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":0.63,"ruleIds":[],"settleType":"POSTPAY","tradeAmount":0.63},"rules":[]},"success":true}'
	},
	{
		remark: "wwww",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6ImVjcyIsImRhdGEiOnsiZHVyYXRpb24iOiIxIiwicHJpY2luZ19jeWNsZSI6ImhvdXIiLCJxdWFudGl0eSI6IjEiLCJ2bV9jcHUiOiI0Iiwidm1fcmFtIjoiNDA5NiIsInZtX2JhbmR3aWR0aCI6IjMwNzIiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV95dW5kdW5fbW9uaXRvciI6IjEiLCJ2bV95dW5kdW5fc2VydmljZSI6IjEiLCJ2bV9pc19mbG93X3R5cGUiOiIwIiwidm1fZGlzayI6W3sic2l6ZSI6IjQwIiwidHlwZSI6InZtX3l1bmRpc2tfc3RvcmFnZSJ9XX19XQ==',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":1.34,"ruleIds":[],"settleType":"POSTPAY","tradeAmount":1.34},"rules":[]},"success":true}'
	},
	{
		remark: "Windows Server 2003 R2 标准版 SP2 32位中文版 已加固激活",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiI0Iiwidm1fcmFtIjoiNDA5NiIsInZtX2JhbmR3aWR0aCI6IjMwNzIiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV9vcyI6IndpbjIwMDNfMzJfc3RhbmRfcjJfY25fNDBHX2FsaWFlZ2lzXzIwMTMwOTEzLnZoZCIsInZtX2Rpc2siOltdLCJkdXJhdGlvbiI6IjEiLCJwcmljaW5nX2N5Y2xlIjoibW9udGgiLCJxdWFudGl0eSI6IjEiLCJ2bV95dW5kdW5fbW9uaXRvciI6IjEiLCJ2bV95dW5kdW5fc2VydmljZSI6IjEifX1d',
		postData:'[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":443.00,"ruleIds":[],"settleType":"PREPAY","tradeAmount":443.00},"rules":[]},"success":true}'
	},
	{
		remark: "Aliyun Linux 5.4 64 位",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMjA0OCIsInZtX2JhbmR3aWR0aCI6IjEwMjQiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV9vcyI6InJoZWw1dTRfNjRfMjBHX2FsaWJhc2VfMjAxMzExMjEudmhkIiwidm1fZGlzayI6W3sidHlwZSI6InZtX3l1bmRpc2tfc3RvcmFnZSIsInNpemUiOiI2MCIsInZtX3NuYXBzaG90X2lkIjpudWxsfV0sImR1cmF0aW9uIjoiMSIsInByaWNpbmdfY3ljbGUiOiJtb250aCIsInF1YW50aXR5IjoiMSIsInZtX3l1bmR1bl9tb25pdG9yIjoiMSIsInZtX3l1bmR1bl9zZXJ2aWNlIjoiMSJ9fV0=',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":230.60,"ruleIds":[],"settleType":"PREPAY","tradeAmount":230.60},"rules":[]},"success":true}'
	},
	{
		remark: "Aliyun Linux 5.4 64位 安全加固版",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMjA0OCIsInZtX2JhbmR3aWR0aCI6IjEwMjQiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV9vcyI6InJoZWw1dTRfNjRfMjBHX2FsaWFlZ2lzXzIwMTMxMTIxLnZoZCIsInZtX2Rpc2siOlt7InR5cGUiOiJ2bV95dW5kaXNrX3N0b3JhZ2UiLCJzaXplIjoiNjAiLCJ2bV9zbmFwc2hvdF9pZCI6bnVsbH1dLCJkdXJhdGlvbiI6IjIiLCJwcmljaW5nX2N5Y2xlIjoibW9udGgiLCJxdWFudGl0eSI6IjEiLCJ2bV95dW5kdW5fbW9uaXRvciI6IjEiLCJ2bV95dW5kdW5fc2VydmljZSI6IjEifX1d',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":461.20,"ruleIds":[],"settleType":"PREPAY","tradeAmount":461.20},"rules":[]},"success":true}'
	},
	{
		remark: 'Aliyun Linux 5.7 64位',
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMjA0OCIsInZtX2JhbmR3aWR0aCI6IjEwMjQiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV9vcyI6InJoZWw1dTdfNjRfMjBHX2FsaWJhc2VfMjAxMzExMjEudmhkIiwidm1fZGlzayI6W3sidHlwZSI6InZtX3l1bmRpc2tfc3RvcmFnZSIsInNpemUiOiIxNDAiLCJ2bV9zbmFwc2hvdF9pZCI6bnVsbH1dLCJkdXJhdGlvbiI6IjIiLCJwcmljaW5nX2N5Y2xlIjoibW9udGgiLCJxdWFudGl0eSI6IjEiLCJ2bV95dW5kdW5fbW9uaXRvciI6IjEiLCJ2bV95dW5kdW5fc2VydmljZSI6IjEifX1d',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":518.80,"ruleIds":[],"settleType":"PREPAY","tradeAmount":518.80},"rules":[]},"success":true}'
	},
	{
		remark: "CentOS 5.4 32位",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMjA0OCIsInZtX2JhbmR3aWR0aCI6IjEwMjQiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV9vcyI6ImNlbnRvczV1NF8zMl8yMEdfYWxpYmFzZV8yMDEzMTEyMS52aGQiLCJ2bV9kaXNrIjpbeyJ0eXBlIjoidm1feXVuZGlza19zdG9yYWdlIiwic2l6ZSI6IjIwMiIsInZtX3NuYXBzaG90X2lkIjpudWxsfV0sImR1cmF0aW9uIjoiMiIsInByaWNpbmdfY3ljbGUiOiJtb250aCIsInF1YW50aXR5IjoiMSIsInZtX3l1bmR1bl9tb25pdG9yIjoiMSIsInZtX3l1bmR1bl9zZXJ2aWNlIjoiMSJ9fV0=',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":563.44,"ruleIds":[],"settleType":"PREPAY","tradeAmount":563.44},"rules":[]},"success":true}'
	},
	{
		remark: "CentOS 6.3 64位 安全加固版",
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMjA0OCIsInZtX2JhbmR3aWR0aCI6IjEwMjQiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV9vcyI6ImNlbnRvczZ1M182NF8yMEdfYWxpYWVnaXNfMjAxMzA4MTYudmhkIiwidm1fZGlzayI6W3sidHlwZSI6InZtX3l1bmRpc2tfc3RvcmFnZSIsInNpemUiOiIyNzYiLCJ2bV9zbmFwc2hvdF9pZCI6bnVsbH1dLCJkdXJhdGlvbiI6IjIiLCJwcmljaW5nX2N5Y2xlIjoibW9udGgiLCJxdWFudGl0eSI6IjEiLCJ2bV95dW5kdW5fbW9uaXRvciI6IjEiLCJ2bV95dW5kdW5fc2VydmljZSI6IjEifX1d',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":616.72,"ruleIds":[],"settleType":"PREPAY","tradeAmount":616.72},"rules":[]},"success":true}'
	},
	{
		remark: 'CentOS 5.7 64位',
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMjA0OCIsInZtX2JhbmR3aWR0aCI6IjEwMjQiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV9vcyI6ImNlbnRvczV1N182NF8yMEdfYWxpYmFzZV8yMDEzMDgxNi52aGQiLCJ2bV9kaXNrIjpbeyJ0eXBlIjoidm1feXVuZGlza19zdG9yYWdlIiwic2l6ZSI6IjU3Iiwidm1fc25hcHNob3RfaWQiOm51bGx9XSwiZHVyYXRpb24iOiIyIiwicHJpY2luZ19jeWNsZSI6Im1vbnRoIiwicXVhbnRpdHkiOiIxIiwidm1feXVuZHVuX21vbml0b3IiOiIxIiwidm1feXVuZHVuX3NlcnZpY2UiOiIxIn19XQ==',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":459.04,"ruleIds":[],"settleType":"PREPAY","tradeAmount":459.04},"rules":[]},"success":true}'
	},
	{
		remark: 'CentOS 5.8 64位',
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiIyIiwidm1fcmFtIjoiMjA0OCIsInZtX2JhbmR3aWR0aCI6IjEwMjQiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV9vcyI6ImNlbnRvczV1OF82NF8yMEdfYWxpYmFzZV8yMDEzMTEyMS52aGQiLCJ2bV9kaXNrIjpbeyJ0eXBlIjoidm1feXVuZGlza19zdG9yYWdlIiwic2l6ZSI6IjU3Iiwidm1fc25hcHNob3RfaWQiOm51bGx9XSwiZHVyYXRpb24iOiIzIiwicHJpY2luZ19jeWNsZSI6Im1vbnRoIiwicXVhbnRpdHkiOiIxIiwidm1feXVuZHVuX21vbml0b3IiOiIxIiwidm1feXVuZHVuX3NlcnZpY2UiOiIxIn19XQ==',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":688.56,"ruleIds":[],"settleType":"PREPAY","tradeAmount":688.56},"rules":[]},"success":true}'
	},
	{
		remark: '测试',
		base64Data: 'W3siY29tbW9kaXR5Q29kZSI6InZtIiwiZGF0YSI6eyJ2bV9jcHUiOiIxIiwidm1fcmFtIjoiMjA0OCIsInZtX2JhbmR3aWR0aCI6IjAiLCJ2bV9yZWdpb25fbm8iOiJjbi1xaW5nZGFvLWNtNS1hMDEiLCJ2bV9vcyI6IiIsInZtX2Rpc2siOltdLCJkdXJhdGlvbiI6IjEiLCJwcmljaW5nX2N5Y2xlIjoieWVhciIsInF1YW50aXR5IjoiMSIsInZtX3l1bmR1bl9tb25pdG9yIjoiMSIsInZtX3l1bmR1bl9zZXJ2aWNlIjoiMSJ9fV0=',
		postData: '[]',
		responseData: '{"data":{"order":{"orderId":0,"orderType":"BUY","originalAmount":688.56,"ruleIds":[],"settleType":"PREPAY","tradeAmount":688.56},"rules":[]},"success":true}'
	}
];

for(var paritem in dataList){
	//raw_data = new Buffer(paritem.base64Data, "base64");
	console.log("##########################################################");
	var raw_data = new Buffer(dataList[paritem].base64Data, encoding='base64').toString();
	console.log(raw_data);
	/*raw_data是一个数组*/
	//console.log("type of raw_data is "+typeof(raw_data));
	//for(sub_item in raw_data){
	//	console.log(raw_data[sub_item]);
	//}
	raw_obj = JSON.parse(raw_data);
	for(var item in raw_obj){
		console.log("commodityCode: 	"+raw_obj[item].commodityCode);
		console.log("data: 		"+dataList[paritem].remark)
		data_obj = raw_obj[item]["data"];
		for(var item in data_obj){
			if(item === "vm_disk"){
				console.log(">>>>  "+item+":")
				for(var disk_item in data_obj[item][0]){
					console.log(">>>>>>>> "+disk_item+": "+data_obj[item][0][disk_item]);
				}
			}
			else
				console.log(">>>>  "+item+": 	"+data_obj[item]);
		}
	}
	console.log("\n");
}