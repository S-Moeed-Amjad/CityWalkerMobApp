import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function MultiSelectDropdown({
  value,
  setValue,
  items,
  setItems,
  isMulti = true,
}: any) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <DropDownPicker
        multiple={isMulti}
        min={0}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Types"
        mode="BADGE"
        showBadgeDot={false}
        // renderBadgeItem={()=>{return }}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={styles.text}
        listItemLabelStyle={styles.text}
        selectedItemLabelStyle={{}}
        labelStyle={styles.text}
        listMode="SCROLLVIEW"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: "white",
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  dropdownContainer: {
    backgroundColor: "white",
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    color: "#40bfff",
    fontWeight: "bold",
  },
});
