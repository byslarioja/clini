<?php

namespace App\Providers;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureModels();

        $this->configureURLs();

        $this->configureDates();

        $this->configureCommands();

        Gate::define('viewPulse', function (User $user) {
            return $user->email === 'sntlln.93@gmail.com';
        });

        $this->configureVite();
    }

    private function configureVite(): void
    {
        Vite::useAggressivePrefetching();
    }

    private function configureURLs(): void
    {
        if ($this->isProduction()) {
            URL::forceScheme('https');
        }
    }

    private function configureCommands(): void
    {
        DB::prohibitDestructiveCommands($this->isProduction());
    }

    private function configureModels(): void
    {
        Model::shouldBeStrict();
        Model::unguard();
    }

    private function configureDates(): void
    {
        Carbon::setLocale('es');
        Date::use(CarbonImmutable::class);
    }

    private function isProduction(): bool
    {
        return $this->app->environment() === 'production';
    }
}
