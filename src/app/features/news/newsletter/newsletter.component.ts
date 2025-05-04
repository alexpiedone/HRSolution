import { Component, Input } from '@angular/core';
import { NewsItem } from '../../../models/newsitem';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-newsletter',
  imports: [CommonModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent {
  @Input() newsItems: NewsItem[] = [];
  
  activeFilter: string = 'all';
  showAllItems: boolean = false;
  categories = ['all', 'Announcement', 'Update', 'Event', 'General'];

  get filteredItems(): NewsItem[] {
    if (this.activeFilter === 'all') return this.newsItems;
    return this.newsItems.filter(item => 
      this.activeFilter === 'all' || item.category === this.activeFilter
    );
  }

  get featuredItem(): NewsItem | undefined {
    return this.newsItems.find(item => item.isFeatured);
  }

  get nonFeaturedItems(): NewsItem[] {
    return this.filteredItems.filter(item => !item.isFeatured);
  }

  toggleBookmark(item: NewsItem): void {
    console.log('Bookmark toggled for:', item.title);
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  getCategoryColor(category: string): string {
    switch(category) {
      case 'Announcement': return 'blue';
      case 'Update': return 'green';
      case 'Event': return 'purple';
      case 'General': return 'yellow';
      default: return 'gray';
    }
  }
}
