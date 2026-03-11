import { View } from '@tarojs/components'
import { AtCalendar } from 'taro-ui'
import './index.scss'

export default function CalendarPicker({ currentDate, onSelect }) {
  const onDayClick = (item) => {
    onSelect(item.value)
  }

  return (
    <View className='calendar-picker'>
      <AtCalendar 
        currentDate={currentDate} 
        onDayClick={onDayClick} 
      />
    </View>
  )
}
