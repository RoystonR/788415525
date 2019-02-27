(function () {
	var cour_name = ["h001", "h002", "h101", "h102", "h103", "h104", "h105", "h106", "h107", "h108", "h109", "h110", "h111", "h112", "h113", "h114", "h115", "h116", "h117", "h118", "h119", "h120", "h121", "h122", "h123", "h124", "h125", "h126", "h127", "h128", "h129", "h130", "h131", "h132", "h133", "h134", "h135", "h201", "h202", "h203", "h204", "h205", "h206", "h207", "h208", "h209", "h210", "h211", "h212", "h213", "h214", "h215", "h216", "h217", "h218", "h219", "h220", "h221", "h222", "h223", "h224", "h225", "h226", "h227", "h228", "h229", "h230", "h231", "h232", "h233", "h234", "h235", "h236", "h237", "h238", "h301", "h302", "h303", "h304", "h305", "h306", "h307", "h308", "h309", "h310", "h311", "h312", "h313", "h314", "h315", "h316", "h317", "h318", "h319", "h320", "h321", "h322", "h323", "h324", "h325", "h326", "h327", "h328", "h329", "h330", "h331", "h332", "h333", "h334", "h335", "h336", "h399", "h401", "h402", "h403", "h404", "h405", "h406", "h407", "h408", "h409", "h410", "h411", "h412", "h413", "h414", "h415", "h416", "h417", "h418", "h419", "h420", "h421", "h422", "h423", "h424", "h425", "h426", "h427", "h428", "h499", "h429", "h430", "h431", "h432", "h444"]
	var h = "h001"
	var	s = "tt1"

	Game.SvMod = []
	
	Game.SvMod.GetMainHUD = function () {
        var globalContext = $.GetContextPanel();
		if (globalContext == undefined || globalContext.paneltype == null)
			return undefined
        while (true) {
            if (globalContext.paneltype == "DOTAHud") {
                break;
            } else {
                globalContext = globalContext.GetParent();
            }
        }
        return globalContext;
    }
	
	if (Game.SvMod.CustomHud != undefined) {
		var OldPanel = Game.SvMod.CustomHud
		OldPanel.DeleteAsync(0)
	}
	
	//
	var lock_everyone = function() {
		function lock_everyone_f() {
			$.Schedule(.1, function(){
				var player_id 	= Game.GetLocalPlayerID()	
				Game.GetAllPlayerIDs().filter(function(b) {
					return b!= player_id
				}).forEach(function(a) {
					$.Schedule(0.1, function(){
						GameEvents.SendCustomGameEventToServer("lock_chess", {
							team: Game.GetPlayerInfo(a).player_team_id
						})
					})
				});
				if (Game.SvMod.CustomHud.FindChild("main_panel").FindChild("controls_panel").FindChild("check_boxs").FindChild("lock_everyone").checked) {
					lock_everyone_f()
				}
			})
		}
		lock_everyone_f()
	}
	

	var dab_button = function() {
		Game.ServerCmd("")
	}
	
	function getRandomCour(min, max) {
		return Math.ceil(Math.random() * (max - min) + min)
	}
	
	
	m_button = function() {
		/*GameEvents.SendCustomGameEventToServer("change_onduty_hero", {
			player_id: Game.GetLocalPlayerID(),
			onduty_hero_new: getRandomCour(0, cour_name.length) + "_" + "tt1"
		})*/
		Game.GetAllPlayerIDs().forEach(function(a) {
			GameEvents.SendCustomGameEventToServer("catch_crab", {
				player_id: Game.GetLocalPlayerID()
			})
		})
	}
	
	m_button2 = function() {
		GameEvents.SendCustomGameEventToServer("change_onduty_hero", {
			player_id: Game.GetLocalPlayerID(),
			onduty_hero_new: cour_name[getRandomCour(0, cour_name.length)] + "_" + "tt1"
		})
	}
	
	function LoadSchedule() {
		var startPosition = null
		if (Game.SvMod.GetMainHUD() != undefined) {
			startPosition = Game.SvMod.GetMainHUD().FindChild('HUDElements').FindChild('minimap_container').actualyoffset
		} else
			startPosition == undefined
		if (startPosition != undefined && startPosition < 9999) {
			if (Game.GetMapInfo().map_display_name !== "normal")
				return
			//310_360
			//<ToggleButton class="CheckBox" id="lock_everyone" onactivate="" text="LOCK EVERYONE" />
			Game.SvMod.CustomHud = $.CreatePanel('Panel', Game.SvMod.GetMainHUD(), 'SVMainPanel');
			Game.SvMod.CustomHud.BLoadLayoutFromString('\
				<root>\
					<styles>\
						<include src="s2r://panorama/styles/dotastyles.vcss_c" />\
					</styles>\
						<Panel style="width:222px;height:166px;background-color:#ffcc99;position: 10px ' + (startPosition - 170) + 'px 0px;border-radius: 6px;">\
							<Panel style="width:218px;height:38px;background-color:#798795;position: 2px 8px 0px;border-radius: 6px;z-index: 999;">\
								<Label style=\'font-size: 34;font-weight: bold;color:#800000;horizontal-align: center;vertical-align: center;font-family: "impact";text-shadow: #fff 0 0 2px;\' text="AutoC2" onactivate="DOTADisplayURL(\'https://google.com/\');"/>\
							</Panel>\
							<Panel id="main_panel" style="width:218px;height:116px;background-color:#798795;position: 2px 48px 0px;border-radius: 6px;z-index: 999;">\
								<Panel id="controls_panel" style="position: 12px 20px 0px;flow-children:down-wrap;">\
									<Panel id="check_boxs" style="position: 6px 10px 0px;flow-children:down-wrap;">\
									</Panel>\
									<Panel id="buttons" style="position: 12px 10px 0px;flow-children:down-wrap;">\
										<Button class="ButtonBevel" id="m_button"  onactivate=""><Label text="CRASH GAME" /></Button>\
										<Button class="ButtonBevel" id="m_button2"  onactivate=""><Label text="RANDOM COUR" /></Button>\
									</Panel>\
								</Panel>\
							</Panel>\
						</Panel>\
				</root>', false, false)
				var check_boxs = Game.SvMod.CustomHud.FindChild("main_panel").FindChild("controls_panel").FindChild("check_boxs")
					//check_boxs.FindChild("m_checkbox").SetPanelEvent('onactivate', m_checkbox)
				var buttons = Game.SvMod.CustomHud.FindChild("main_panel").FindChild("controls_panel").FindChild("buttons")
					buttons.FindChild("m_button").SetPanelEvent('onactivate', m_button)
					buttons.FindChild("m_button2").SetPanelEvent('onactivate', m_button2)
		} else {
			$.Schedule(0.1,function(){
				LoadSchedule()
			})
		}
		
	}
	LoadSchedule()
})();
