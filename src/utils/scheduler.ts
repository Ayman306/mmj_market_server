class SchedularUtilityClass {
  /**
   * @description
   * start all the schedule jobs
   */
  start(): void {
    console.log('Schedular has started')
  }
}
export const scheduler = new SchedularUtilityClass()
