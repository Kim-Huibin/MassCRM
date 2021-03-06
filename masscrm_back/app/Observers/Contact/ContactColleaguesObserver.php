<?php

namespace App\Observers\Contact;

use App\Models\ActivityLog\ActivityLogContact;
use App\Models\Contact\Contact;
use App\Models\Contact\ContactColleagues;
use ReflectionClass;

class ContactColleaguesObserver
{
    private const FIELD_LINK = 'link';
    private const NAME_FIELDS = [self::FIELD_LINK];

    public function created(ContactColleagues $contactColleagues): void
    {
        /** @var Contact $contact */
        $contact = $contactColleagues->contact;

        if ($contact->getUpdatedAt()->diffInSeconds($contact->getCreatedAt()) < 5) {
            return;
        }

        foreach(self::NAME_FIELDS as $item) {
            (new ActivityLogContact())
                ->setUserId($contact->getUserId())
                ->setActivityType(ActivityLogContact::ADDED_NEW_VALUE_FIELD_EVENT)
                ->setContactId($contact->getId())
                ->setModelName((new ReflectionClass($contactColleagues))->getShortName())
                ->setModelField($item)
                ->setDataNew($contactColleagues->{$item})
                ->setLogInfo($contactColleagues->toJson())
                ->save();
        }
    }

    public function updated(ContactColleagues $contactColleagues): void
    {
        /** @var Contact $contact */
        $contact = $contactColleagues->contact;

        foreach ($contactColleagues->getChanges() as $key => $value) {
            if (in_array($key, self::NAME_FIELDS, true)) {
                (new ActivityLogContact())
                    ->setUserId($contact->getUserId())
                    ->setActivityType(ActivityLogContact::UPDATE_VALUE_FIELD_EVENT)
                    ->setContactId($contact->getId())
                    ->setModelName((new ReflectionClass($contactColleagues))->getShortName())
                    ->setModelField($key)
                    ->setDataNew($contactColleagues->{$key})
                    ->setDataOld($contactColleagues->getOriginal($key))
                    ->setLogInfo($contactColleagues->toJson())
                    ->save();
            }
        }
    }

    public function deleting(ContactColleagues $contactColleagues): void
    {
        /** @var Contact $contact */
        $contact = $contactColleagues->contact;

        (new ActivityLogContact())
            ->setUserId($contact->getUserId())
            ->setActivityType(ActivityLogContact::DELETE_VALUE_FIELD_EVENT)
            ->setContactId($contact->getId())
            ->setModelName((new ReflectionClass($contactColleagues))->getShortName())
            ->setModelField(self::FIELD_LINK)
            ->setDataOld($contactColleagues->getOriginal(self::FIELD_LINK))
            ->setLogInfo($contactColleagues->toJson())
            ->save();
    }
}