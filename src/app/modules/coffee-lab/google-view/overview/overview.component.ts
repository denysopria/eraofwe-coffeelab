import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoffeeLabService, ResizeService, StartupService } from '@services';
import { takeUntil } from 'rxjs/operators';
import { RouterMap, SlugMap } from '@constants';
import { MenuItem } from 'primeng/api';
import { PostType, RouterSlug } from '@enums';
import { getLangRoute } from '@utils';
import { ResizeableComponent } from '@base-components';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent extends ResizeableComponent implements OnInit {
    menuItems: MenuItem[] = [];
    postType: PostType;

    constructor(
        private coffeeLabService: CoffeeLabService,
        private router: Router,
        private startupService: StartupService,
        protected resizeService: ResizeService,
    ) {
        super(resizeService);
    }

    ngOnInit(): void {
        this.coffeeLabService.forumLanguage.pipe(takeUntil(this.unsubscribeAll$)).subscribe((language) => {
            this.menuItems = this.getMenuItems(language);
            this.startupService.load(language);
            let currentRouter = this.router.url;
            if (currentRouter) {
                currentRouter = currentRouter.split('/')[2].split('?')[0];
            }
            this.setPostType(SlugMap[currentRouter] || RouterSlug.QA);
            const destinationRouter = `/${getLangRoute(language)}/${
                RouterMap[language][SlugMap[currentRouter] || RouterSlug.QA]
            }`;
            if (this.router.url !== destinationRouter) {
                this.router.navigate([destinationRouter], { queryParamsHandling: 'merge' });
            }
        });
    }

    setPostType(routerSlug: RouterSlug) {
        switch (routerSlug) {
            case RouterSlug.QA: {
                this.postType = PostType.QA;
                break;
            }
            case RouterSlug.ARTICLE: {
                this.postType = PostType.ARTICLE;
                break;
            }
            case RouterSlug.RECIPE: {
                this.postType = PostType.RECIPE;
                break;
            }
            case RouterSlug.EOW: {
                this.postType = PostType.ARTICLE;
                break;
            }
        }
    }

    getMenuItems(language) {
        return [
            {
                label: 'question_answers',
                routerLink: `/${getLangRoute(language)}/${RouterMap[language][RouterSlug.QA]}`,
                icon: 'assets/images/qa-forum.svg',
                activeIcon: 'assets/images/qa-forum-active.svg',
                command: () => this.setPostType(RouterSlug.QA),
            },
            {
                label: 'posts',
                routerLink: `/${getLangRoute(language)}/${RouterMap[language][RouterSlug.ARTICLE]}`,
                icon: 'assets/images/article.svg',
                activeIcon: 'assets/images/article-active.svg',
                command: () => this.setPostType(RouterSlug.ARTICLE),
            },
            {
                label: 'brewing_guides',
                routerLink: `/${getLangRoute(language)}/${RouterMap[language][RouterSlug.RECIPE]}`,
                icon: 'assets/images/coffee-recipe.svg',
                activeIcon: 'assets/images/coffee-recipe-active.svg',
                command: () => this.setPostType(RouterSlug.RECIPE),
            },
            {
                label: 'about_era_of_we',
                routerLink: `/${getLangRoute(language)}/${RouterMap[language][RouterSlug.EOW]}`,
                icon: 'assets/images/era-of-we.svg',
                activeIcon: 'assets/images/era-of-we-active.svg',
                command: () => this.setPostType(RouterSlug.EOW),
            },
        ];
    }
}
