(function () {
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
	
	var m_recharge = function() {
		GameEvents.SendCustomGameEventToServer("preview_effect", {
            hero_index: Game.GetLocalPlayerInfo().player_selected_hero_entity_index,
            effect: "mana_recharge_10"
        })
	}
	
	var m_armor = function() {
		GameEvents.SendCustomGameEventToServer("preview_effect", {
            hero_index: Game.GetLocalPlayerInfo().player_selected_hero_entity_index,
            effect: "battle_armor_reduce_20"
        })
	}
	var m_add = function() {
		GameEvents.SendCustomGameEventToServer("preview_effect", {
            hero_index: Game.GetLocalPlayerInfo().player_selected_hero_entity_index,
            effect: "a201"
        })
	}
		
	var invis = function() {
		GameEvents.SendCustomGameEventToServer("preview_effect", {
            hero_index: Game.GetLocalPlayerInfo().player_selected_hero_entity_index,
            effect: "minion_attack_split"
        })		
	}
	
	var d_chess_mov = function() {
		function d_chess_mov_f() {
			$.Schedule(.1, function(){
				var player_id 	= Game.GetLocalPlayerID()	
				Game.GetAllPlayerIDs().filter(function(b) {
					return b!= player_id
				}).forEach(function(a) {
					$.Schedule(0.1, function(){
						GameEvents.SendCustomGameEventToServer("cancel_pick_chess_position", {
							player_id: a
						})
					})
				});
				if (Game.SvMod.CustomHud.FindChild("main_panel").FindChild("controls_panel").FindChild("check_boxs").FindChild("d_chess_mov").checked) {
					d_chess_mov()
				}
			})
		}
		d_chess_mov_f()
	}
	
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
	
	GameEvents.Subscribe( "show_draw_card", function(a) {
		var cards = a.cards.split(',');

		if (Game.SvMod.CustomHud.FindChild("main_panel").FindChild("controls_panel").FindChild("check_boxs").FindChild("buy_chess").checked) {
			cards.forEach(function(a) {
				if (a == "chess_gyro" || a == "chess_lich" || a == "chess_th" || a == "chess_enigma" || a == "chess_tech") {
					GameEvents.SendCustomGameEventToServer("select_chess", {
						chess: a,
						mana: 5,
						team: Game.GetPlayerInfo(Game.GetLocalPlayerID()).player_team_id
					})	
					
				}
			})
		}
	});
	
	
	CastAbility_to_Target = function( ability, target, source ) {	
		var order = {
			OrderType: 		dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
			TargetIndex: 	target,
			Position: 		0,
			AbilityIndex: 	ability,
			OrderIssuer: 	PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY,
			UnitIndex: 		source,
			QueueBehavior: 	"false",
			ShowEffects: 	"true"
		}
		Game.PrepareUnitOrders(order) 
	}


	var buy_chess = function() {
		function buy_all_f() {
			
			if (Players.GetLevel(Game.GetLocalPlayerID()) < 10) {
				var entity_index = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
				var exp_book = Entities.GetAbilityByName( entity_index	, "exp_book" )
				if (Abilities.IsCooldownReady(exp_book))
					Abilities.ExecuteAbility( exp_book, entity_index, true )
			} else{
				GameEvents.SendCustomGameEventToServer("dac_refresh_chess", {
					team: Game.GetPlayerInfo(Game.GetLocalPlayerID()).player_team_id
				})
			}
	
			
			$.Schedule(0.2, function() {
				if (Game.SvMod.CustomHud.FindChild("main_panel").FindChild("controls_panel").FindChild("check_boxs").FindChild("buy_chess").checked) {
					buy_all_f()
				}
			})

		}
		buy_all_f()
	}
	
	var drop_chess = function() {
		function drop_chess_f() {
			var team_id 	 = Game.GetPlayerInfo(Game.GetLocalPlayerID()).player_team_id
			var player_id	 = Game.GetLocalPlayerID()
			var entity_index = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
			var ability = Entities.GetAbilityByName(entity_index, "pick_chess")
			var vector  = GameUI.GetCursorPosition()
			Entities.GetAllEntities().forEach(function(a){
				if (Entities.GetTeamNumber(a) == team_id){
					if (Entities.GetUnitName(a) == "chess_gyro" || 
						Entities.GetUnitName(a) == "chess_lich" || 
						Entities.GetUnitName(a) == "chess_th" || 
						Entities.GetUnitName(a) == "chess_enigma" || 
						Entities.GetUnitName(a) == "chess_tech") {
						CastAbility_to_Target(ability, a, entity_index)
						
						GameEvents.SendCustomGameEventToServer("pick_chess_position", {
							x: vector[0],
							y: vector[1],
							z: vector[2],
							player_id: player_id
						})
					}
				}
			})
			
			
			
			$.Schedule(0.2, function() {
				if (Game.SvMod.CustomHud.FindChild("main_panel").FindChild("controls_panel").FindChild("check_boxs").FindChild("drop_chess").checked) {
					drop_chess_f()
				}
			})

		}
		drop_chess_f()
	}
	var dab_button = function() {
		Game.ServerCmd("say Umbrella - лучший чит для доты - https://vk.com/cheats_dota")
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
						<Panel style="width:222px;height:382px;background-color:#ffcc99;position: 10px 300px 0px;border-radius: 6px;">\
							<Panel style="width:218px;height:38px;background-color:#798795;position: 2px 8px 0px;border-radius: 6px;z-index: 999;">\
								<Label style=\'font-size: 34;font-weight: bold;color:#800000;horizontal-align: center;vertical-align: center;font-family: "impact";text-shadow: #fff 0 0 2px;\' text="AutoChess" onactivate="DOTADisplayURL(\'https://google.com/\');"/>\
							</Panel>\
							<Panel id="main_panel" style="width:218px;height:332px;background-color:#798795;position: 2px 48px 0px;border-radius: 6px;z-index: 999;">\
								<Panel id="controls_panel" style="position: 12px 20px 0px;flow-children:down-wrap;">\
									<Panel id="check_boxs" style="position: 6px 10px 0px;flow-children:down-wrap;">\
										<ToggleButton class="CheckBox" id="d_chess_mov" onactivate="" text="DISABLE CHESS MOVE" />\
										<ToggleButton class="CheckBox" id="lock_everyone" onactivate="" text="LOCK EVERYONE" />\
										<ToggleButton class="CheckBox" id="buy_chess" onactivate="" text="BUY 5LVL" />\
									</Panel>\
									<Panel id="buttons" style="position: 12px 10px 0px;flow-children:down-wrap;">\
										<Button class="ButtonBevel"    id="m_recharge_button"  onactivate=""><Label text="+ MANA recharge" /></Button>\
										<Button class="ButtonBevel"    id="m_armor_button"  onactivate=""><Label text="Armor_Reduce_20" /></Button>\
										<Button class="ButtonBevel"    id="m_add_button"  onactivate=""><Label text="+3 MANA" /></Button>\
										<Button class="ButtonBevel"    id="invis_button"  onactivate=""><Label text="minion_attack_split" /></Button>\
										<Button class="ButtonBevel"    id="dab_button"  onactivate=""><Label text="ADS ON CHAT" /></Button>\
									</Panel>\
								</Panel>\
							</Panel>\
						</Panel>\
				</root>', false, false)
				var check_boxs = Game.SvMod.CustomHud.FindChild("main_panel").FindChild("controls_panel").FindChild("check_boxs")
					check_boxs.FindChild("d_chess_mov").SetPanelEvent('onactivate', d_chess_mov)
					check_boxs.FindChild("lock_everyone").SetPanelEvent('onactivate', lock_everyone)
					check_boxs.FindChild("buy_chess").SetPanelEvent('onactivate', buy_chess)
				var buttons = Game.SvMod.CustomHud.FindChild("main_panel").FindChild("controls_panel").FindChild("buttons")
					buttons.FindChild("m_recharge_button").SetPanelEvent('onactivate', m_recharge)
					buttons.FindChild("m_armor_button").SetPanelEvent('onactivate', m_armor)
					buttons.FindChild("m_add_button").SetPanelEvent('onactivate', m_add)
					buttons.FindChild("invis_button").SetPanelEvent('onactivate', invis)
					buttons.FindChild("dab_button").SetPanelEvent('onactivate', dab_button)
		} else {
			$.Schedule(0.1,function(){
				LoadSchedule()
			})
		}
		
	}
	LoadSchedule()
})();