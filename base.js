;(function(window){

	window.IniciarInstapage = function(__debug){
		
		var __variables = ("ijQuery,_codigoAnalytics,_codigoPixelFacebook,_headerEstatico,_bloqueSlider,_bloqueYoutube,_bloqueYoutubeID,_crmURL,_crmCampos,_crmAdicionales,_validacionesCampoRut,_validacionesFormulario,_traduccionesFormularios,_callbackCargado,_callbackFormulario,_callbackInicio").split(",");
		var __variables_tmp;
		if( __debug ){ console.log(__variables); }
		for(var __variables_i = 0, __variables_t = __variables.length; __variables_i < __variables_t; __variables_i++){
			__variables_tmp = __variables[ __variables_i ] ];
			if( !window[ __variables_tmp ]  ){ window[ __variables_tmp ] = ""; }
			if( __debug ){
				console.log("Var: "+__variables_tmp, window[ __variables_tmp ] );
			} 
		}

		// A) ANTES DE TODO

		// A.1) ACTIVAR GOOGLE ANALYTICS
		if( _codigoAnalytics.length  > 1 ){
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			ga( 'create', _codigoAnalytics, 'auto');
			ga( 'send', 'pageview' );
		}

		// A.2) ACTIVAR PIXEL FACEBOOK
		if( _codigoPixelFacebook.length  > 1 ){
			!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
				n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
				n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
				t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
				document,'script','https://connect.facebook.net/en_US/fbevents.js');
			fbq('init', _codigoPixelFacebook);
			fbq('track', "PageView");
		}

		// A.3) AGREGAR VALIDACIONES "TIPO"
		if( _validacionesCampoRut.length > 0 ){

			function _verificadorRut(T){var M=0,S=1;for(;T;T=Math.floor(T/10))
				S=(S+T%10*(9-M++%6))%11;return S?S-1:'k';}

			_validacionesFormulario.__rut = {
				validacion: function(valor, elemento){
					var dv = (""+valor).slice(-1);
					var rutnum = (""+valor).slice(0,-1).replace(/\D/g,'')*1;
					var dv_check = _verificadorRut(rutnum);
					return ( dv == dv_check && rutnum > 1000000);
				},
				mensaje: "Ingrese un RUT valido",
				campo: _validacionesCampoRut,
			};
		}

		// A.4) EJECUTAR CALLBACK
		_callbackInicio();

		// A.5) REGISTRAR UTILIDADES
		function _util_extraerUrl(url, que, def){
			url = (""+url).toLowerCase();
			var inicio = url.indexOf(que);
			if( inicio > -1){
				inicio = inicio + que.length +1;
				url = url.substr(inicio);
				def = url.split("&")[0];
			}
			def = def.split("+").join(" ").toLowerCase();
			return def;
		};


		// B) DESPUES DE CARGAR LA PAGINA
		ijQuery(document).ready(function() {

			// B.1) HEADER ESTATICO
			if(_headerEstatico){
				ijQuery('.page-block').first().css({"position":"fixed","width":"100%","top":"0","z-index":999999999999});
			}

			
			// B.2) TRADUCIR LOS MENSAJES DEL FORMULARIO
			// CODIGO: _Translate.set( "original", "Traduccion" );
			for( var _traduccionTmp in _traduccionesFormularios ){
				_Translate.set( _traduccionTmp, _traduccionesFormularios[_traduccionTmp] );
			}

			// B.3) AGREGAR VALIDACION
			for( var _validacionTmp in _validacionesFormulario ){
				var _validacionTmp_nombre = 'validation'+_validacionTmp;
				var _validacionTmp_obj = _validacionesFormulario[_validacionTmp];
				ijQuery.validator.addMethod( _validacionTmp_nombre, _validacionTmp_obj.validacion);
				ijQuery( 'form [name="' + base64_encode( _validacionTmp_obj.campo ) + '"]' ).addClass( _validacionTmp_nombre );
				ijQuery.validator.messages[_validacionTmp_nombre] = _validacionTmp_obj.mensaje;
			}

			// B.4) BLOQUE SLIDER
			_bloqueSlider = _bloqueSlider -1;
			if( _bloqueSlider > -1 ){
				var sliderImagenes = [];
				var sliderIndice = 0;
				var sliderTotal = 0;
				var sliderBloque = ijQuery('.page-block').eq( _bloqueSlider );
				var sliderFondo = ijQuery("<div class='sliderFondo' style='position:absolute; width:100%; height:100%; top:0; left:0; background-color: transparent; background-repeat: repeat; background-position: center center; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover; border-width: 0; border-top-width: 0px; border-bottom-width: 0px;'></div>");
				var sliderFondo2 = sliderFondo.clone();
				sliderFondo.css("z-index", 2);
				sliderFondo2.css("z-index", 1);
				sliderFondo.appendTo(sliderBloque);
				sliderFondo2.appendTo(sliderBloque);

				ijQuery('.page-block').eq( _bloqueSlider +1 ).hide().find('img').each(function(sliderIndice, sliderElemento){
					sliderImagenes.push("url("+ sliderElemento.src +")");
				}).end();

				sliderTotal = sliderImagenes.length;

				var sliderCambiarImagen = function(){
					sliderIndice = sliderIndice+1;
					sliderIndice = sliderIndice%sliderTotal;

					sliderFondo.fadeOut(function(){
						sliderFondo.css('background-image', sliderImagenes[ sliderIndice ]).fadeIn(function(){
							sliderFondo2.css('background-image', sliderImagenes[ sliderIndice ]);
						});
					});

					setTimeout(function(){ sliderCambiarImagen(); }, 4000);
				};

				sliderCambiarImagen();
			}

			// B.5) BLOQUE YOUTUBE
			_bloqueYoutube = _bloqueYoutube -1;
			if( _bloqueYoutube > -1 ){
				var youtubeBloque = ijQuery('.page-block').eq( _bloqueYoutube );
				youtubeBloque.css({"overflow":"hidden"}).append('<div class="video-background"><div class="video-foreground" id="video-foreground"><iframe src="https://www.youtube.com/embed/'+ _bloqueYoutubeID +'?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&playlist='+ _bloqueYoutubeID +'" frameborder="0" allowfullscreen></iframe></div></div>').find(".color-overlay").css({"z-index":"1"});

				var youtubeWindow = ijQuery(window);

				var youtubeForeground = youtubeBloque.find(".video-foreground");
				youtubeForeground.css({ width: youtubeWindow.innerWidth() + 'px' });

				youtubeWindow.resize(function(){      
					youtubeForeground.css({ width: youtubeWindow.innerWidth() + 'px' });
				});

				ijQuery("head").append("<style> @media only screen and (max-width: 640px){ .video-background{ display: none; } } </style> <style> @media only screen and (min-width: 640px){ .video-background { position: absolute; top: 0; right: 0; bottom: 0; left: 0; } .video-foreground, .video-background iframe { position: absolute; pointer-events: none; top: 50%; left: 50%; min-width: 100%; min-height: 100%; width: auto; height: auto; transform: translateX(-50%) translateY(-50%); background-size: cover; transition: 1s opacity; height: calc(100vh + 150px); width: 100%; } } </style>");
			}

			// B.6) CAPTURAR VALORES UTM
			var _urlForm = ijQuery("form").eq(0);
			console.log("HAY FORMULARIO?", _urlForm.length > 0);
			if( _urlForm.length ){
				var _url = ""+window.location.href;
				_urlForm.append("<input type='hidden' name='utm_source' value='" + _util_extraerUrl(_url, "utm_source", "sin fuente") + "'>");
				_urlForm.append("<input type='hidden' name='utm_medium' value='" + _util_extraerUrl(_url, "utm_medium", "sin medio") + "'>");
			}

			
			// B.7) CALLBACK YA CARGADO
			_callbackCargado();

			

			// C) DESPUES DE CARGAR EL FORMULARIO
			window.instapageFormSubmitSuccess = function( form ){

				// C.1) MARCAR EL LEAD EN FACEBOOK Y ANALYTICS
				// ga.send: categoria, accion, etiqueta, valor
				if( window["ga"] ){ ga('send', 'event', "Formulario", "Envio", "Contacto", 1); }
				if( window["fbq"] ){ fbq('track', 'Lead'); }
				
				// C.2) MANDAR AL CRM
				if( _crmURL.length > 1 ){

					var _crmForm = ijQuery( form );
					var _crmData = {};
					var _crmTmp;

					for( _crmTmp in _crmCampos ){
						_crmData[ _crmCampos[_crmTmp] ] = _crmForm.find( 'input[name="'+ base64_encode( _crmTmp ) +'"]').val();
					}
					
					if(_crmAdicionales.length > 0){
						var _crmAdicionales = _crmAdicionales.split(",");
						var _crmAdicionales_i;
						var _crmAdicionales_total = _crmAdicionales.length;
						for(_crmAdicionales_i = 0; _crmAdicionales_i < _crmAdicionales_total; _crmAdicionales_i++){
							_crmTmp = _crmAdicionales[ _crmAdicionales_i ].split(":");
							if( _crmTmp.length == 2 ){
								_crmData[ (""+_crmTmp[0]).trim() ] = (""+_crmTmp[1]).trim();
							}
						}
					}
					
					var _crmRequest = ijQuery.ajax({
						url: _crmURL,
						type: "post",
						data: _crmData
					});				
				}

				_callbackFormulario( form );

			};

		});

	}
})(window);
