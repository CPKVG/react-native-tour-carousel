import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type {
  DecreasingDot,
  DotConfig,
} from 'react-native-animated-dots-carousel';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import Pagination from './components/Pagination';
import CarouselSlides from './components/Slides';
import { widthPercentage } from './utils/layout';

type TourCarouselType = {
  data: any[];
  viewedCount?: number;
  handleBottomButtonPress?: (arg0: boolean) => void;
  handleSkipButtonPress?: () => void;
  skipButtonConfig?: {
    skipButtonStyle?: StyleProp<ViewStyle>;
    skipButtonContainer?: StyleProp<ViewStyle>;
    titleStyle?: string;
    title?: string;
    disabled?: boolean;
    skipButtonTestID?: string;
    maxSkipCount?: number;
    skipable?: boolean;
  };

  carouselConfig?: {
    container?: StyleProp<ViewStyle>;

    style?: StyleProp<ViewStyle>;
    loop?: boolean;
    pagingEnabled?: boolean;
    snapEnabled?: boolean;
    autoPlayInterval?: number;
    scrollAnimationDuration?: number;
    autoPlay?: boolean;
    vertical?: boolean;
    height?: number;
    slideConfig?: any;
  };
  PaginationConfig?: {
    showDots: boolean;
    index: number;
    length: number;
    activeIndicatorConfig: DotConfig;
    inactiveIndicatorConfig: DotConfig;
    decreasingDots: DecreasingDot[];
    containerStyle: DotConfig[];
    dotColor?: StyleProp<ViewStyle>; // TODO add
    dotStyle?: StyleProp<ViewStyle>; // TODO add
    maxIndicators: number;
  };
  buttonConfig?: {
    buttonTestID?: string;
    nextButtonText?: string;
    finishButtonText?: string;
    bottomButtonContainer?: StyleProp<ViewStyle>;
    bottomButtonTextStyle?: StyleProp<ViewStyle>;
  };
};

/** This function is intended to be ported over to a library
 * Intentionally condensed into one file to make porting process simpler.
 *
 * @param param0 TourCarouselType
 * @returns JSX.Element
 */
const TourCarousel = ({
  data,
  viewedCount = 0,
  handleBottomButtonPress,
  handleSkipButtonPress,
  skipButtonConfig,
  carouselConfig,
  PaginationConfig,
  buttonConfig,
}: TourCarouselType): JSX.Element => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [currentSlideNumber, setCurrentSlideNumber] = useState(1);
  const {
    skipButtonStyle,
    skipButtonContainer,
    title = 'skip',
    skipButtonTestID: skipButtonTestID,
    maxSkipCount,
    skipable = true,
  } = skipButtonConfig || {};

  const {
    container,
    vertical,
    height,
    style,
    loop = false,
    pagingEnabled,
    snapEnabled,
    autoPlay,
    autoPlayInterval,
    scrollAnimationDuration,
    slideConfig,
  } = carouselConfig || {};

  const {
    showDots = true,
    length = data.length,
    activeIndicatorConfig,
    inactiveIndicatorConfig,
    decreasingDots,
    containerStyle,
    maxIndicators,
  } = PaginationConfig || {};

  const {
    buttonTestID,
    nextButtonText = 'Next',
    finishButtonText = 'Finish',
    bottomButtonContainer,
    bottomButtonTextStyle,
  } = buttonConfig || {};

  const lastSlide = activeSlideIndex === data.length - 1;

  const carouselRef = useRef<any>();
  const progressValue = useSharedValue<number>(0);

  if (activeSlideIndex + 1 > currentSlideNumber) {
    setCurrentSlideNumber(activeSlideIndex + 1);
  }

  const slideWidth = widthPercentage(84);
  const itemHorizontalMargin = widthPercentage(8);

  const itemWidth = slideWidth + itemHorizontalMargin * 2;

  return (
    <View style={container || styles.container}>
      {/* Skip button */}
      {skipable && (
        <TouchableOpacity
          testID={skipButtonTestID}
          style={skipButtonContainer || styles.skipButtonContainer}
          disabled={viewedCount === maxSkipCount}
          onPress={handleSkipButtonPress}
        >
          <Text style={skipButtonStyle || styles.skipButtonStyle}>{title}</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <>
        <Carousel
          vertical={vertical || false}
          width={itemWidth}
          height={height || itemWidth * 1.5}
          ref={carouselRef}
          style={style}
          loop={loop}
          pagingEnabled={pagingEnabled}
          snapEnabled={snapEnabled}
          autoPlay={autoPlay}
          autoPlayInterval={autoPlayInterval}
          scrollAnimationDuration={scrollAnimationDuration}
          onProgressChange={(_, absoluteProgress): number =>
            (progressValue.value = absoluteProgress)
          }
          mode={'parallax'}
          data={data}
          renderItem={({ item }): JSX.Element => (
            <CarouselSlides
              data={item}
              itemHorizontalMargin={itemHorizontalMargin}
              slideConfig={slideConfig}
            />
          )}
          onSnapToItem={(index: number): void => setActiveSlideIndex(index)}
        />
      </>

      {/* Slide dots */}

      <View style={styles.bottomContainer}>
        {showDots && (
          <Pagination
            currentIndex={activeSlideIndex}
            length={length}
            activeIndicatorConfig={activeIndicatorConfig}
            inactiveIndicatorConfig={inactiveIndicatorConfig}
            decreasingDots={decreasingDots}
            containerStyle={containerStyle}
            maxIndicators={maxIndicators || length}
          />
        )}

        {/* Next / Finish button */}

        <TouchableOpacity
          testID={buttonTestID || 'ConsultBottomButton'}
          onPress={(): void[] => [
            handleBottomButtonPress && handleBottomButtonPress(lastSlide),
            carouselRef?.current?.next(),
          ]}
        >
          <View style={bottomButtonContainer || styles.bottomButtonContainer}>
            <Text style={bottomButtonTextStyle || styles.bottomButtonTextStyle}>
              {lastSlide ? finishButtonText : nextButtonText}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  skipButtonStyle: {
    color: 'black',
    fontSize: 16,
  },
  skipButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 8,
    paddingVertical: 5,
    marginRight: 10,
  },
  slider: {
    overflow: 'visible',
  },
  sliderContentContainer: {
    paddingBottom: 10,
  },
  paginationContainer: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    height: 'auto',
  },
  bottomButtonContainer: {
    borderWidth: 2,
    borderRadius: 6,
    backgroundColor: 'black',
    marginBottom: 32,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginHorizontal: 22,
  },
  bottomButtonTextStyle: {
    color: 'white',
    fontSize: 18,
  },
});

export default TourCarousel;
