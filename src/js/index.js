const dogRaceElement = document.getElementById('dogRace');
const dogSubRaceElement = document.getElementById('dogSubRace');
const buttonCheckElement = document.getElementById('buttonCheck');
const printImgElement = document.getElementById('printImg');
const buttonSaveElement = document.getElementById('buttonSave');
const savedImagesElement = document.getElementById('savedImages');

const LS = window.localStorage;

let dogRaceSelection = '';
let dogSubRaceSelection = '';
let urlImg = '';

let urlImages = [];

// peticiones a la appi
const fetchData = async url => {
	const response = await fetch(url);
	const data = await response.json();
	return data;
};

// funcion para recoger la lista de razas de perros y pintarlas
const getAllDogs = async () => {
	const data = await fetchData(`https://dog.ceo/api/breeds/list/all`);

	const dogRace = Object.keys(data.message);
	for (let i = 0; i < dogRace.length; i++) {
		const dogRaceOption = document.createElement('option');
		dogRaceOption.textContent = dogRace[i];
		dogRaceElement.append(dogRaceOption);
	}
};
getAllDogs();

// funcion para pintar las subrazas
const getSubRaceDogs = async () => {
	const data = await fetchData(`https://dog.ceo/api/breeds/list/all`);
	const dogRace = Object.keys(data.message);
	const dogSubRace = Object.values(data.message);

	const positionDogRace = dogRace.indexOf(dogRaceSelection);
	dogSubRaceElement.innerHTML = '';
	if (dogSubRace[positionDogRace].length > 0) {
		dogSubRaceElement.classList.add('show');
		dogSubRaceElement.classList.remove('no-show');
		const dogSelectOption = document.createElement('option');
		dogSelectOption.textContent = 'seleccione opción';
		dogSubRaceElement.append(dogSelectOption);
		for (let i = 0; i < dogSubRace[positionDogRace].length; i++) {
			const dogSubRaceOption = document.createElement('option');
			dogSubRaceOption.textContent = dogSubRace[positionDogRace][i];
			dogSubRaceElement.append(dogSubRaceOption);
		}
	}
	if (dogSubRace[positionDogRace].length === 0) {
		dogSubRaceElement.classList.add('no-show');
		dogSubRaceElement.classList.remove('show');
	}
};

// funcion para crear la lista de las subrazas
const selectRace = event => {
	dogRaceSelection = event.target.value;
	getSubRaceDogs();
};
const selectSubRace = event => {
	dogSubRaceSelection = event.target.value;
};

// pintar la imagen de las razas seleccionadas
const printImg = data => {
	printImgElement.innerHTML = '';
	const newImg = document.createElement('img');
	newImg.src = data.message;
	printImgElement.append(newImg);
	urlImg = data.message;
};

// buscar la imagen en la appi
const checkIMG = async () => {
	let data;
	if (dogSubRaceSelection === '') {
		data = await fetchData(
			`https://dog.ceo/api/breed/${dogRaceSelection}/images/random`
		);
	} else {
		data = await fetchData(
			`https://dog.ceo/api/breed/${dogRaceSelection}/${dogSubRaceSelection}/images/random`
		);
	}
	printImg(data);
};
// pintar las imagenes favoritas
const printFavoriteDogs = favoriteDogs => {
	savedImagesElement.innerHTML = '';
	for (let i = 0; i < urlImages.length; i++) {
		const newImg = document.createElement('img');
		newImg.src = favoriteDogs[i];
		const newButton = document.createElement('button');
		newButton.textContent = 'x';
		newButton.id = favoriteDogs[i];
		newButton.addEventListener('click', deleteImage);
		const newDivImg = document.createElement('div');
		newDivImg.append(newImg, newButton);
		savedImagesElement.append(newDivImg);
	}
};

// guardar imagenes en el localstorage
const saveImg = () => {
	if (urlImages.includes(urlImg)) return;
	urlImages.push(urlImg);
	LS.setItem('imagenes', JSON.stringify(urlImages));
	const favoriteDogs = JSON.parse(LS.getItem('imagenes'));
	printFavoriteDogs(favoriteDogs);
	console.log(urlImages);
};
const deleteImage = event => {
	console.log(event.target.id);

	const placeToRemove = urlImages.indexOf(event.target.id);
	console.log(placeToRemove);
	urlImages.splice(placeToRemove, 1);

	event.target.parentNode.remove();
	console.log(urlImages);

	LS.setItem('imagenes', JSON.stringify(urlImages));
};
const readLS = () => {
	const images = JSON.parse(LS.getItem('imagenes'));
	console.log(images);
	if (images.length > 0) {
		urlImages = images;

		printFavoriteDogs(urlImages);
	} else {
		urlImages = [];
		LS.setItem('imagenes', JSON.stringify(urlImages));
	}
};

readLS();

dogRaceElement.addEventListener('change', selectRace);
dogSubRaceElement.addEventListener('change', selectSubRace);
buttonCheckElement.addEventListener('click', checkIMG);
buttonSaveElement.addEventListener('click', saveImg);
