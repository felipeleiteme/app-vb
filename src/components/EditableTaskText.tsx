import React, { useState, useRef, useEffect } from 'react';
import { TextInput, Platform } from 'react-native';
import { Text, Pressable } from 'native-base';

interface EditableTaskTextProps {
  text: string;
  completed: boolean;
  onSave: (newText: string) => void;
  onToggle: () => void;
}

const EditableTaskText: React.FC<EditableTaskTextProps> = ({ 
  text, 
  completed, 
  onSave, 
  onToggle 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setEditText(text);
  }, [text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelection(editText.length, editText.length);
    }
  }, [isEditing, editText.length]);

  const handleDoublePress = () => {
    if (!completed) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== text) {
      onSave(trimmedText);
    } else if (!trimmedText) {
      setEditText(text); // Restaura o texto original se estiver vazio
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TextInput
        ref={inputRef}
        value={editText}
        onChangeText={setEditText}
        onBlur={handleSave}
        onSubmitEditing={handleSave}
        onKeyPress={(e) => {
          if (Platform.OS === 'web' && e.nativeEvent.key === 'Escape') {
            handleCancel();
          }
        }}
        style={{
          flex: 1,
          fontSize: 16,
          color: completed ? '#9CA3AF' : '#1F2937',
          textDecorationLine: completed ? 'line-through' : 'none',
          paddingVertical: 4,
          paddingHorizontal: 8,
          backgroundColor: '#F9FAFB',
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#D1D5DB',
        }}
        placeholder="Digite a tarefa..."
        returnKeyType="done"
        autoCapitalize="sentences"
      />
    );
  }

  return (
    <Pressable 
      onPress={onToggle}
      onLongPress={handleDoublePress}
      _pressed={{ opacity: 0.5 }}
      flex={1}
      py="1"
    >
      <Text
        strikeThrough={completed}
        color={completed ? 'coolGray.400' : 'coolGray.800'}
        fontSize="md"
        fontStyle={completed ? 'italic' : 'normal'}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default EditableTaskText;
