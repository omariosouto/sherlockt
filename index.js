/*
	Modelo para usar com "Contact Form"
	<div class="clearfix" style="display:none;">
		[text sherlockt_tracking_originlead]
		[textarea sherlockt_tracking_navhistory placeholder]
		[text sherlockt_tracking_browser]
		[text sherlockt_tracking_os]
		[text sherlockt_tracking_platform]
	</div>
*/
(function(win, doc){

	var sherlockt_rastreamento = {
		leftZero: function(number) {
			return (number < 10 ? '0' : '') + number;
		},
		currentDate: function() {
			var d = new Date, currentDate = [
				this.leftZero(d.getDate()),
				this.leftZero(d.getMonth()+1),
				this.leftZero(d.getFullYear())
			].join('/')+' '+ [this.leftZero(d.getHours()), this.leftZero(d.getMinutes()), this.leftZero(d.getSeconds())].join(':');
			return currentDate;
		},
		getPlatform: function() {
			return navigator.appVersion;
		},
		getCurrentUrl: function() {
			return window.location.href;
		},
		getReferrer: function() {
			return document.referrer;
		},
		getOrigin: function() {

			if(this.getCurrentUrl().match(/gclid=/) && this.getReferrer().match(/google.com/)) {
				console.log( this.getReferrer());
				return 'BUSCA PAGA';
			}

			if(this.getReferrer() == "") {
				console.log( this.getReferrer());
				return 'ORIGEM DIRETA';			
			}


			if(!this.getReferrer().match(/YOURSITE.com.br/)) {
				console.log( this.getReferrer());
				return 'ORIGEM ORGÃNICA ou EXTERNA';
			}

			if(this.getReferrer().match(/YOURSITE.com.br/)) {
				console.log( this.getReferrer());
				return 'NAVEGAÇÃO INTERNA';
			}

			return 'NAVEGAÇÃO DESCONHECIDA';
		},
		getOS: function() {
			var OSName="Unknown OS";
			if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
			if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
			if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
			if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
			if (navigator.appVersion.indexOf("iPad")!=-1) OSName="iOS";
			if (navigator.appVersion.indexOf("iPhone")!=-1) OSName="iOS";
			if (navigator.appVersion.indexOf("Android")!=-1) OSName="Android";
			return OSName;
		},
		getBrowser: function() {
			navigator.sayswho= (function(){
			    var ua= navigator.userAgent, tem, 
			    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
			    if(/trident/i.test(M[1])){
			        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
			        return 'IE '+(tem[1] || '');
			    }
			    if(M[1]=== 'Chrome'){
			        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
			        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
			    }
			    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
			    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
			    return M.join(' ');
			})();

			return navigator.sayswho;

		},
		totalSession: 0,
		getSession: function() {
			var sherlockt_rastreamentoJSON = JSON.parse(localStorage.getItem('sherlockt_rastreamento_PROD')) || [];
			this.totalSession = sherlockt_rastreamentoJSON.length;
			return sherlockt_rastreamentoJSON;
		},
		setSession: function() {
			var getSession     = this.getSession();
			var currentSession = this.currentSession();
			var totalSession   = this.totalSession - 1;

			if(getSession[totalSession]) {
				if(getSession[totalSession].origem === currentSession.origem) {
					return false;
				}
			}

			getSession.push(currentSession);

			try {
				localStorage.setItem('sherlockt_rastreamento_PROD', JSON.stringify(getSession));
				return true;
			} catch(err) {
				console.error(err);
				return false;
			}
		},
		currentSession: function() {
			return {
				'origemTipo': this.getOrigin(),
				'origem': this.getReferrer(),
				'currentURL': this.getCurrentUrl(),
				'data': this.currentDate(),
				'browser': this.getBrowser(),
				'os': this.getOS(),
				'platformFullInfo': this.getPlatform()
			};
		},
		getSessionReport: function() {
			var sessionReport = "";
			var deviceInfo = "";
			this.getSession().forEach(function(session, index) {
				sessionReport += (index + 1) + ': ' + session.origemTipo + '\n';
				sessionReport += 'URL ACESSADA: ' + session.currentURL + '\n';
				sessionReport += 'URL ORIGEM: ' + session.origem + '\n';
				sessionReport += 'DATA e HORA: ' + session.data + '\n';
				sessionReport += '\n\n';
			});

			return sessionReport;
		},
		getPlatformReport: function() {

		},
		getLeadOrigin: function() {
			return this.getSession()[0].origemTipo;
		},
		populateForms: function() {
			var self = this;
			var tracking_originlead = doc.querySelectorAll('[name="sherlockt_tracking_originlead"]');
			var tracking_navhistory = doc.querySelectorAll('[name="sherlockt_tracking_navhistory"]');
			var tracking_browser = doc.querySelectorAll('[name="sherlockt_tracking_browser"]');
			var tracking_os = doc.querySelectorAll('[name="sherlockt_tracking_os"]');
			var tracking_platform = doc.querySelectorAll('[name="sherlockt_tracking_platform"]');

			console.log('tracking_originlead: ', tracking_originlead);
			Array.prototype.forEach.call(tracking_originlead, function(element, index) {
				element.value = self.getLeadOrigin();
			});

			console.log('tracking_navhistory: ', tracking_navhistory);
			Array.prototype.forEach.call(tracking_navhistory, function(element, index) {
				element.value = self.getSessionReport();
			});

			console.log('tracking_browser: ', tracking_browser);
			Array.prototype.forEach.call(tracking_browser, function(element, index) {
				element.value = self.getBrowser();
			});

			console.log('tracking_os: ', tracking_os);
			Array.prototype.forEach.call(tracking_os, function(element, index) {
				element.value = self.getOS();
			});

			console.log('tracking_platform: ', tracking_platform);
			Array.prototype.forEach.call(tracking_platform, function(element, index) {
				element.value = self.getPlatform();
			});

			// console.log('tracking_navhistory: ', tracking_navhistory);
			// console.log('tracking_browser: ', tracking_browser);
			// console.log('tracking_os: ', tracking_os);
			// console.log('tracking_platform: ', tracking_platform);
		},
		init: function() {
			console.log('START');
			this.setSession();
			this.populateForms();
		}
	}

	win.sherlockt_rastreamento = sherlockt_rastreamento;

})(window, document);
sherlockt_rastreamento.init();









