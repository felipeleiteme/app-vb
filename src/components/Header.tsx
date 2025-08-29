
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface HeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  onLeftIconPress?: () => void;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, leftIcon, onLeftIconPress, rightIcon, onRightIconPress }) => {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Pressable onPress={onLeftIconPress}>
          {leftIcon}
        </Pressable>
      </View>
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.right}>
        <Pressable onPress={onRightIconPress}>
          {rightIcon}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#3784C2',
    paddingVertical: 17,
    paddingHorizontal: 25,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Header;
