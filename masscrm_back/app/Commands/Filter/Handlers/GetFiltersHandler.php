<?php

namespace App\Commands\Filter\Handlers;

use App\Commands\Filter\GetFiltersCommand;
use Illuminate\Support\Facades\Lang;

class GetFiltersHandler
{
    protected const LANG_FILE = 'filters.';

    public const COLUMN_SEPARATOR = 'column_separator';
    public const CONTACTS_TYPE = 'contacts_type';
    public const IMPORT_SOURCE = 'import_source';
    public const FIELDS = 'fields';
    public const GENDERS = 'genders';
    public const COMPANY_SIZE = 'company_size';
    public const ORIGIN = 'origin';
    public const COMPANY_TYPE = 'company_type';
    public const FILTERS = [
        self::COLUMN_SEPARATOR, self::CONTACTS_TYPE, self::IMPORT_SOURCE, self::FIELDS, self::GENDERS,
        self::COMPANY_SIZE, self::ORIGIN, self::COMPANY_TYPE
    ];

    public function handle(GetFiltersCommand $command): array
    {
        $filterNames = empty($command->getFilters())
            ? self::FILTERS
            : $command->getFilters();

        $filters = [];
        foreach ($filterNames as $name) {
            $filters[$name] = Lang::get(self::LANG_FILE . $name, [], $command->getLanguage());
        }

        return $filters;
    }
}
