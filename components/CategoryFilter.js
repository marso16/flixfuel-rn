import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, FONTS, SPACING } from "../utils/constants";

const CategoryFilter = ({
  categories = [],
  selectedCategory = null,
  onCategorySelect,
  showAllOption = true,
}) => {
  const handleCategoryPress = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category === selectedCategory ? null : category);
    }
  };

  const renderCategoryItem = (category, isSelected) => (
    <TouchableOpacity
      key={category}
      style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
      onPress={() => handleCategoryPress(category)}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.categoryText, isSelected && styles.categoryTextSelected]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {showAllOption && renderCategoryItem("All", selectedCategory === null)}
        {categories.map((category) =>
          renderCategoryItem(category, category === selectedCategory)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.SMALL,
  },
  scrollContent: {
    paddingHorizontal: SPACING.MEDIUM,
    gap: SPACING.SMALL,
  },
  categoryItem: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    borderRadius: 20,
    backgroundColor: COLORS.GRAY[100],
    borderWidth: 1,
    borderColor: COLORS.GRAY[200],
    marginRight: SPACING.SMALL,
    minWidth: 60,
    alignItems: "center",
  },
  categoryItemSelected: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  categoryText: {
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.MEDIUM,
    color: COLORS.GRAY[700],
  },
  categoryTextSelected: {
    color: COLORS.WHITE,
    fontWeight: FONTS.WEIGHTS.SEMI_BOLD,
  },
});

export default CategoryFilter;
