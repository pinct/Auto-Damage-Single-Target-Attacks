on("chat:message", function(msg) {
    if (msg.rolltemplate) {
        var TokenID = "";
        _.each(msg.inlinerolls, function(roll) {
            if (roll.expression.match(/\[ID.*?\]/g) != null) TokenID = roll.expression.match(/\[ID.*?\]/g)[0].split("ID")[1].split("]")[0].trim();
        });
        if (TokenID == "") return;
        var Token = getObj("graphic", TokenID);
        var CharID = (Token != null) ? Token.get("represents") : "";
        if (CharID == "") return;
        var Char = getObj("character", CharID);
        if (Char !== undefined && Char.get("controlledby").includes(msg.playerid)) return;
        var resistances = (getAttrByName(CharID, "npc_resistances") != null) ? getAttrByName(CharID, "npc_resistances").toLowerCase() : "";
        var immunities = (getAttrByName(CharID, "npc_immunities") != null) ? getAttrByName(CharID, "npc_immunities").toLowerCase() : "";
        var vulnurabilities = (getAttrByName(CharID, "npc_vulnerabilities") != null) ? getAttrByName(CharID, "npc_vulnerabilities").toLowerCase() : "";
        var Advantage = (msg.content.match(/({{advantage=)\d/g) != null) ? 1 : 0;
        var Normal = (msg.content.match(/({{normal=)\d/g) != null) ? 1 : 0;
        var Disadvantage = (msg.content.match(/({{disadvantage=)\d/g) != null) ? 1 : 0;
        var Atk1 = parseInt(msg.content.match(/({{r1=\$\[\[\d+\]\]}})/g)[0].split("[[")[1].split("]]")[0]);
        var Atk2 = parseInt(msg.content.match(/({{r2=\$\[\[\d+\]\]}})/g)[0].split("[[")[1].split("]]")[0]);
        var Dmg1 = parseInt(msg.content.match(/({{dmg1=\$\[\[\d+\]\]}})/g)[0].split("[[")[1].split("]]")[0]);
        var Dmg2 = parseInt(msg.content.match(/({{dmg2=\$\[\[\d+\]\]}})/g)[0].split("[[")[1].split("]]")[0]);
        var GDmg = (msg.content.match(/({{globaldamage=\$\[\[\d+\]\]}})/g) != null) ? parseInt(msg.content.match(/({{globaldamage=\$\[\[\d+\]\]}})/g)[0].split("[[")[1].split("]]")[0]) : -1;
        var HLDmg = (msg.content.match(/({{hldmg=\$\[\[\d+\]\]}})/g) != null) ? parseInt(msg.content.match(/({{hldmg=\$\[\[\d+\]\]}})/g)[0].split("[[")[1].split("]]")[0]) : -1;
        var GCrit = (msg.content.match(/({{globaldamagecrit=\$\[\[\d+\]\]}})/g) != null) ? parseInt(msg.content.match(/({{globaldamagecrit=\$\[\[\d+\]\]}})/g)[0].split("[[")[1].split("]]")[0]) : 0;
        var HLCrit = (msg.content.match(/({{hldmgcrit=\$\[\[\d+\]\]}})/g) != null) ? parseInt(msg.content.match(/({{hldmgcrit=\$\[\[\d+\]\]}})/g)[0].split("[[")[1].split("]]")[0]) : 0;
        var Crit1 = parseInt(msg.content.match(/({{crit1=\$\[\[\d+\]\]}})/g)[0].split("[[")[1].split("]]")[0]);
        var Crit2 = parseInt(msg.content.match(/({{crit2=\$\[\[\d+\]\]}})/g)[0].split("[[")[1].split("]]")[0]);
        var Atk1Base = (msg.inlinerolls[Atk1].results.rolls[0].dice != 0) ? parseInt(msg.inlinerolls[Atk1].results.rolls[0].results[0].v) : 0;
        var Atk1Total = (msg.inlinerolls[Atk1].results.rolls[0].dice != 0) ? parseInt(msg.inlinerolls[Atk1].results.total) : 0;
        var Atk1Crit = (msg.inlinerolls[Atk1].results.rolls[0].mods != null) ? parseInt(msg.inlinerolls[Atk1].results.rolls[0].mods.customCrit[0].point) : 20;
        var Atk2Base = (msg.inlinerolls[Atk2].results.rolls[0].dice != 0) ? parseInt(msg.inlinerolls[Atk2].results.rolls[0].results[0].v) : 0;
        var Atk2Total = (msg.inlinerolls[Atk2].results.rolls[0].dice != 0) ? parseInt(msg.inlinerolls[Atk2].results.total) : 0;
        var Atk2Crit = (msg.inlinerolls[Atk2].results.rolls[0].mods != null) ? parseInt(msg.inlinerolls[Atk2].results.rolls[0].mods.customCrit[0].point) : 20;
        var Dmg1Total = parseInt(msg.inlinerolls[Dmg1].results.total);
        var Dmg2Total = parseInt(msg.inlinerolls[Dmg2].results.total);
        var Dmg1Type = (msg.content.match(/{{dmg1type=\w+/g) != null) ? msg.content.match(/{{dmg1type=\w+/g)[0].split("=")[1] : "";
        var Dmg2Type = (msg.content.match(/{{dmg2type=\w+/g) != null) ? msg.content.match(/{{dmg2type=\w+/g)[0].split("=")[1] : "";
        var Crit1Dmg = parseInt(msg.inlinerolls[Crit1].results.total);
        var Crit2Dmg = parseInt(msg.inlinerolls[Crit2].results.total);
        var Damage = 0;
        if (HLDmg != -1){
            var HLDmgTotal = parseInt(msg.inlinerolls[HLDmg].results.total);
            var HLCritDmg = parseInt(msg.inlinerolls[HLCrit].results.total);
            Dmg1Total += HLDmgTotal;
            Crit1Dmg += HLCritDmg;
        }
        if (msg.content.match(/({{globaldamage=\$\[\[\d+\]\]}})/g) != null){
            var GDmg = parseInt(msg.content.match(/({{globaldamage=\$\[\[\d+\]\]}})/g)[0].split("[[")[1].split("]]")[0]);
            var GCrit = parseInt(msg.content.match(/({{globaldamagecrit=\$\[\[\d+\]\]}})/g)[0].split("[[")[1].split("]]")[0]);
            var GDmgTotal = parseInt(msg.inlinerolls[GDmg].results.total);
            var GCritDmg = parseInt(msg.inlinerolls[GCrit].results.total);
            var SHDmg = 0;
            var SHCrit = 0;
            var DmgTypes  = (msg.content.match(/{{globaldamagetype=.*}}/g) != null) ? msg.content.match(/{{globaldamagetype=.*}}/g)[0].split("=")[1].split("}}")[0].split("/") : "";
            var typeTracker = -1;
            for (var i=0; i<msg.inlinerolls[GDmg].results.rolls.length; i++){
                if (msg.inlinerolls[GDmg].results.rolls[i].results != null){
                    typeTracker++;
                    if (resistances.includes(DmgTypes[typeTracker].toLowerCase())){
                        var tempTotal = 0;
                        for (var j=0; j<msg.inlinerolls[GDmg].results.rolls[i].results.length; j++){
                            tempTotal += msg.inlinerolls[GDmg].results.rolls[i].results[j].v;
                        }
                        GDmgTotal -= Math.ciel(tempTotal/2);
                        tempTotal = 0;
                        for (var j=0; j<msg.inlinerolls[GCrit].results.rolls[i].results.length; j++){
                            tempTotal += msg.inlinerolls[GCrit].results.rolls[i].results[j].v;
                        }
                        GCritDmg -= Math.ciel(tempTital/2);
                    } else if (immunities.includes(DmgTypes[typeTracker].toLowerCase())){
                        var tempTotal = 0;
                        for (var j=0; j<msg.inlinerolls[GDmg].results.rolls[i].results.length; j++){
                            tempTotal += msg.inlinerolls[GDmg].results.rolls[i].results[j].v;
                        }
                        GDmgTotal -= tempTotal;
                        tempTotal = 0;
                        for (var j=0; j<msg.inlinerolls[GCrit].results.rolls[i].results.length; j++){
                            tempTotal += msg.inlinerolls[GCrit].results.rolls[i].results[j].v;
                        }
                        GCritDmg -= tempTotal;
                    } else if (vulnurabilities.includes(DmgTypes[typeTracker].toLowerCase())){
                        var tempTotal = 0;
                        for (var j=0; j<msg.inlinerolls[GDmg].results.rolls[i].results.length; j++){
                            tempTotal += msg.inlinerolls[GDmg].results.rolls[i].results[j].v;
                        }
                        GDmgTotal += tempTotal;
                        tempTotal = 0;
                        for (var j=0; j<msg.inlinerolls[GCrit].results.rolls[i].results.length; j++){
                            tempTotal += msg.inlinerolls[GCrit].results.rolls[i].results[j].v;
                        }
                        GCritDmg += tempTotal;
                    } else if (DmgTypes[typeTracker].toLowerCase().includes("sneak") || DmgTypes[typeTracker].toLowerCase().includes("hunter")){
                        var tempTotal = 0;
                        for (var j=0; j<msg.inlinerolls[GDmg].results.rolls[i].results.length; j++){
                            tempTotal += msg.inlinerolls[GDmg].results.rolls[i].results[j].v;
                        }
                        GDmgTotal -= tempTotal;
                        SHDmg += tempTotal;
                        tempTotal = 0;
                        for (var j=0; j<msg.inlinerolls[GCrit].results.rolls[i].results.length; j++){
                            tempTotal += msg.inlinerolls[GCrit].results.rolls[i].results[j].v;
                        }
                        GCritDmg -= tempTotal;
                        SHCrit += tempTotal;
                    }
                }
            }
        } else {
            var GDmgTotal = 0;
            var GCritDmg = 0;
            var SHDmg = 0;
            var SHCrit = 0;
        }
        if (immunities.includes(Dmg1Type.toLowerCase())){
            Dmg1Total = 0;
            Crit1Dmg = 0;
        }
        if (immunities.includes(Dmg2Type.toLowerCase())){
            Dmg2Total = 0;
            Crit2Dmg = 0;
        }
        if (immunities.includes(Dmg1Type.toLowerCase()) && immunities.includes(Dmg2Type.toLowerCase())){
            SHDmg = 0;
            SHCrit = 0;
        }
        GDmgTotal = (GDmgTotal < 0) ? 0 : GDmgTotal;
        GCritDmg = (GCritDmg < 0) ? 0 : GCritDmg;
        if (msg.content.match(/({{save=)\d/g) != null){
            var Save = 1;
            var SaveAttr = (msg.content.match(/{{saveattr=\w+/g) != null) ? msg.content.match(/{{saveattr=\w+/g)[0].split("=")[1] : "";
            var SaveDesc = (msg.content.match(/{{savedesc=\w+/g) != null) ? msg.content.match(/{{savedesc=\w+/g)[0].split("=")[1] : "";
            if (resistances.includes(Dmg1Type.toLowerCase()) && resistances.includes(Dmg2Type.toLowerCase())){
                var SpellDmg = Math.floor((Dmg1Total + Dmg2Total)/2);
            } else if (resistances.includes(Dmg1Type.toLowerCase())){
                var SpellDmg = Math.floor(Dmg1Total/2) + Dmg2Total;
            } else if (resistances.includes(Dmg1Type.toLowerCase())){
                var SpellDmg = Math.floor(Dmg2Total/2) + Dmg2Total;
            } else if (vulnurabilities.includes(Dmg1Type.toLowerCase()) && resistances.includes(Dmg2Type.toLowerCase())){
                var SpellDmg = (Dmg1Total + Dmg2Total)*2;
            } else if (vulnurabilities.includes(Dmg1Type.toLowerCase())){
                var SpellDmg = Dmg1Total*2 + Dmg2Total;
            } else if (vulnurabilities.includes(Dmg1Type.toLowerCase())){
                var SpellDmg = Dmg2Total*2 + Dmg1Total;
            } else {
                var SpellDmg = Dmg1Total + Dmg2Total;
            }
            var SaveDC = msg.content.match(/({{savedc=\$\[\[\d+\]\]}})/g)[0].split("[[")[1].split("]]")[0];
            var DC = msg.inlinerolls[SaveDC].results.total;
        }
        if (Normal === 1 || Advantage === 1 || Disadvantage === 1) {
            // NORMAL
            var AtkBase = Atk1Base;
            var AtkTotal = Atk1Total;
            var AtkCrit = Atk1Crit;
            
            // ADVANTAGE
            if (Advantage === 1 && Atk2Total > Atk1Total) {
                AtkBase = Atk2Base;
                AtkTotal = Atk2Total;
                AtkCrit = Atk2Crit;
            }
            
            // DISADVANTAGE
            if (Disadvantage === 1 && Atk2Total < Atk1Total) {
                AtkBase = Atk2Base;
                AtkTotal = Atk2Total;
                AtkCrit = Atk2Crit;
            }
            // RESOLVE ATTACK ROLLS
            var TokenAC = (getAttrByName(CharID, "npc") == 1) ? parseInt(getAttrByName(CharID, "npc_ac")) : parseInt(getAttrByName(CharID, "ac"));
            if (AtkBase === 1) return;
            if (AtkBase >= AtkCrit) {
                if (resistances != ""){
                    if (resistances.includes(Dmg1Type.toLowerCase()) && resistances.includes(Dmg2Type.toLowerCase())) {
                        Damage = (Math.floor((Dmg1Total + Dmg2Total + Crit1Dmg + Crit2Dmg + SHDmg + SHCrit)/2)) + GDmgTotal + GCritDmg;
                    } else if (resistances.includes(Dmg1Type.toLowerCase())) {
                        Damage = (Math.floor((Dmg1Total + Crit1Dmg)/2)) + Dmg2Total + Crit2Dmg + GDmgTotal + GCritDmg + SHDmg + SHCrit;
                    } else if (resistances.includes(Dmg2Type.toLowerCase())) {
                        Damage = (Math.floor((Dmg2Total + Crit2Dmg)/2)) + Dmg1Total + Crit1Dmg + GDmgTotal + GCritDmg + SHDmg + SHCrit;
                    }
                } else if (vulnurabilities != ""){
                    if (vulnurabilities.includes(Dmg1Type.toLowerCase()) && vulnurabilities.includes(Dmg2Type.toLowerCase())){
                        Damage = (Dmg1Total + Dmg2Total + Crit1Dmg + Crit2Dmg + SHDmg + SHCrit)*2 + GDmgTotal + GCritDmg;
                    } else if (vulnurabilities.includes(Dmg1Type.toLowerCase())){
                        Damage = (Dmg1Total + Crit1Dmg)*2 + Dmg2Total + Crit2Dmg + GDmgTotal + GCritDmg + SHDmg + SHCrit;
                    } else if (vulnurabilities.includes(Dmg2Type.toLowerCase())){
                        Damage = (Dmg2Total + Crit2Dmg)*2 + Dmg1Total + Crit1Dmg + GDmgTotal + GCritDmg + SHDmg + SHCrit;
                    }
                } else {
                    Damage = Dmg1Total + Dmg2Total + GDmgTotal + Crit1Dmg + Crit2Dmg + SHCrit + GCritDmg;
                } 
            }  else if (AtkTotal >= TokenAC) {
                if (resistances != ""){
                    if (resistances.includes(Dmg1Type.toLowerCase()) && resistances.includes(Dmg2Type.toLowerCase())) {
                        Damage = Math.floor((Dmg1Total + Dmg2Total + SHDmg)/2) + GDmgTotal;
                    } else if (resistances.includes(Dmg1Type.toLowerCase())) {
                        Damage = Math.floor(Dmg1Total/2) + Dmg2Total + GDmgTotal + SHDmg;
                    } else if (resistances.includes(Dmg2Type.toLowerCase())) {
                        Damage = Math.floor(Dmg2Total/2) + Dmg1Total + GDmgTotal + SHDmg;
                    }
                } else if (vulnurabilities != ""){
                    if (vulnurabilities.includes(Dmg1Type.toLowerCase()) && vulnurabilities.includes(Dmg2Type.toLowerCase())) {
                        Damage = ((Dmg1Total + Dmg2Total + SHDmg)*2) + GDmgTotal;
                    } else if (vulnurabilities.includes(Dmg1Type.toLowerCase())) {
                        Damage = (Dmg1Total*2) + Dmg2Total + GDmgTotal + SHDmg;
                    } else if (vulnurabilities.includes(Dmg2Type.toLowerCase())) {
                        Damage = (Dmg2Total*2) + Dmg1Total + GDmgTotal + SHDmg;
                    }
                } else {
                    Damage = Dmg1Total + Dmg2Total + SHDmg + GDmgTotal;
                }
            } else {
                Damage = 0;
            }
            //Damage = (AtkTotal >= TokenAC) ? Dmg1Total + Dmg2Total + GDmgTotal : 0;
            //Damage = (AtkBase >= AtkCrit) ? Damage + Crit1Dmg + Crit2Dmg + GCritDmg : Damage;
            if (Damage > 0) setTimeout(function() { sendChat("", "!alter --target|" + TokenID + " --bar|3 --amount|-" + Damage) }, 1500);
        } else if (Save === 1){
            var tokenSave = Math.floor(Math.random() * 21) + getAttrByName(CharID, SaveAttr.toLowerCase() + "_save_bonus");
            if (SaveDesc.toLowerCase().includes("half")){
                Damage = (tokenSave < DC) ? SpellDmg : Math.floor(SpellDmg/2);
            } else if (SaveDesc.toLowerCase().includes("no")){
                Damage = (tokenSave < DC) ? SpellDmg : 0;
            }
            setTimeout(function() { sendChat("", "Enemy save = " + tokenSave)}, 1500);
            if (Damage > 0) setTimeout(function() { sendChat("", "!alter --target|" + TokenID + " --bar|3 --amount|-" + Damage) }, 1500);
        }
        if (Damage > 0 && Token.get("statusmarkers").includes("stopwatch")){
            var tokenSave = Math.floor(Math.random() * 21) + getAttrByName(CharID, "constitution_save_bonus");
            ConDC = (Math.floor(Damage/2) > 10) ? Math.floor(Damage/2) : 10;
            if (tokenSave < ConDC){
                sendChat("", "Failed DC of " + ConDC + " by rolling a " + tokenSave + ", dropping concentration.");
                currentMarkers = Token.get("statusmarkers").split(',');
                index = currentMarkers.indexOf("stopwatch");
                if (index > -1){
                    currentMarkers.splice(index);
                    Token.set("statusmarkers", currentMarkers.join(','));
                }
            } else {
                sendChat("", "Passed DC of " + ConDC + " by rolling a " + tokenSave + ", keeping concentration.");
            }
        }
    }
});
