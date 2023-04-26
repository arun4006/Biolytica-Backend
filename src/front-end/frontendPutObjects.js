document.getElementById('putObjectBtns').addEventListener('click', () => {
	console.log("file called");
// 	const putObject_fileInput = document.getElementById('putObjects');
//    console.log(putObject_fileInput);  
// 	const array = Array.from(putObject_fileInput.files); 
// 	array.forEach(file => {
// 	// const file = putObject_fileInput.files[0];
// 	const fileName = file.name;

// 	const reader = new FileReader();
// 	const url = `https://8hho3mnu3f.execute-api.us-east-1.amazonaws.com/dev/putObject`;
// 	//const url=`https://8hho3mnu3f.execute-api.us-east-1.amazonaws.com/dev/putImage`;
// 	const config = {
// 		onUploadProgress: (progressEvent) =>
// 			console.log(parseInt(Math.round(progressEvent.loaded / progressEvent.total * 100)))
// 	};

// 	reader.onloadend = () => {
// 		const base64String = reader.result.split('base64,')[1];  

// 		const dataInfo = {
// 			fileName: fileName, 
// 			base64String: base64String 
// 		};

// 		axios
// 			.post(url, dataInfo, config)
// 			.then((r) => {
// 				console.log(r);
// 			})
// 			.catch((err) => {
// 				console.error(err);
// 			});
// 	};
// 	reader.readAsDataURL(file);
// });
});