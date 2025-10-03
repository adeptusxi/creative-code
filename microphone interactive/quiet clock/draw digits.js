function drawDigit(value, place) {
	switch(value) {
		case 0:
			draw0(place);
			break;
		case 1:
			draw1(place);
			break;
		case 2:
			draw2(place);
			break;
		case 3:
			draw3(place);
			break;
		case 4:
			draw4(place);
			break;
		case 5:
			draw5(place);
			break;
		case 6:
			draw6(place);
			break;
		case 7:
			draw7(place);
			break;
		case 8:
			draw8(place);
			break;
		case 9:
			draw9(place);
			break;
	}
}

function draw0(place) {
	lline(place.a, place.b);
	lline(place.b, place.c);
	lline(place.c, place.d);
	lline(place.d, place.e);
	lline(place.e, place.f);
	lline(place.f, place.a);
	ppoint(place.a);
	ppoint(place.b);
	ppoint(place.c);
	ppoint(place.d);
	ppoint(place.e);
	ppoint(place.f);
}

function draw1(place) {
	lline(place.b, place.c);
	lline(place.c, place.d);
	ppoint(place.b);
	ppoint(place.c);
	ppoint(place.d);
}

function draw2(place) {
	lline(place.a, place.b);
	lline(place.b, place.c);
	lline(place.c, place.f);
	lline(place.f, place.e);
	lline(place.e, place.d);
	ppoint(place.a);
	ppoint(place.b);
	ppoint(place.c);
	ppoint(place.d);
	ppoint(place.e);
	ppoint(place.f);
}

function draw3(place) {
	lline(place.a, place.b);
	lline(place.b, place.c);
	lline(place.c, place.f);
	lline(place.c, place.d);
	lline(place.d, place.e);
	ppoint(place.a);
	ppoint(place.b);
	ppoint(place.c);
	ppoint(place.d);
	ppoint(place.e);
	ppoint(place.f);
}

function draw4(place) {
	lline(place.b, place.c);
	lline(place.c, place.f);
	lline(place.f, place.a);
	lline(place.c, place.d);
	ppoint(place.a);
	ppoint(place.b);
	ppoint(place.c);
	ppoint(place.d);
	ppoint(place.f);
}

function draw5(place) {
	lline(place.a, place.b);
	lline(place.a, place.f);
	lline(place.f, place.c);
	lline(place.c, place.d);
	lline(place.d, place.e);
	ppoint(place.a);
	ppoint(place.b);
	ppoint(place.c);
	ppoint(place.d);
	ppoint(place.e);
	ppoint(place.f);
}

function draw6(place) {
	lline(place.a, place.b);
	lline(place.c, place.f);
	lline(place.c, place.d);
	lline(place.d, place.e);
	lline(place.e, place.f);
	lline(place.f, place.a);
	ppoint(place.a);
	ppoint(place.b);
	ppoint(place.c);
	ppoint(place.d);
	ppoint(place.e);
	ppoint(place.f);
}

function draw7(place) {
	lline(place.a, place.b);
	lline(place.b, place.c);
	lline(place.c, place.d);
	ppoint(place.a);
	ppoint(place.b);
	ppoint(place.c);
	ppoint(place.d);
}

function draw8(place) {
	lline(place.a, place.b);
	lline(place.b, place.c);
	lline(place.c, place.d);
	lline(place.d, place.e);
	lline(place.e, place.f);
	lline(place.f, place.a);
	lline(place.c, place.f);
	ppoint(place.a);
	ppoint(place.b);
	ppoint(place.c);
	ppoint(place.d);
	ppoint(place.e);
	ppoint(place.f);
}

function draw9(place) {
	lline(place.a, place.b);
	lline(place.b, place.c);
	lline(place.c, place.d);
	lline(place.d, place.e);
	lline(place.c, place.f);
	lline(place.f, place.a);
	ppoint(place.a);
	ppoint(place.b);
	ppoint(place.c);
	ppoint(place.d);
	ppoint(place.e);
	ppoint(place.f);
}