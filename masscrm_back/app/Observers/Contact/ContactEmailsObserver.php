<?php

namespace App\Observers\Contact;

use App\Models\Contact\Contact;
use App\Models\ActivityLog\ActivityLogContact;
use App\Models\Contact\ContactEmails;
use ReflectionClass;

class ContactEmailsObserver
{
    private const FIELD_EMAIL = 'email';
    private const FIELD_VERIFICATION = 'verification';
    private const NAME_FIELDS = [self::FIELD_EMAIL, self::FIELD_VERIFICATION];

    public function created(ContactEmails $contactEmails): void
    {
        /** @var Contact $contact */
        $contact = $contactEmails->contact;

        if ($contact->getUpdatedAt()->diffInSeconds($contact->getCreatedAt()) < 5) {
            return;
        }

        foreach(self::NAME_FIELDS as $item) {
            (new ActivityLogContact())
                ->setUserId($contact->getUserId())
                ->setActivityType(ActivityLogContact::ADDED_NEW_VALUE_FIELD_EVENT)
                ->setContactId($contact->getId())
                ->setModelName((new ReflectionClass($contactEmails))->getShortName())
                ->setModelField($item)
                ->setDataNew($contactEmails->{$item})
                ->setLogInfo($contactEmails->toJson())
                ->setAdditionalInfoForData($contactEmails->getEmail())
                ->save();
        }
    }

    public function updated(ContactEmails $contactEmails): void
    {
        /** @var Contact $contact */
        $contact = $contactEmails->contact;

        foreach ($contactEmails->getChanges() as $key => $value) {
            if (in_array($key, self::NAME_FIELDS, true)) {
                (new ActivityLogContact())
                    ->setUserId($contact->getUserId())
                    ->setActivityType(ActivityLogContact::UPDATE_VALUE_FIELD_EVENT)
                    ->setContactId($contact->getId())
                    ->setModelName((new ReflectionClass($contactEmails))->getShortName())
                    ->setModelField($key)
                    ->setDataNew($contactEmails->{$key})
                    ->setDataOld($contactEmails->getOriginal($key))
                    ->setLogInfo($contactEmails->toJson())
                    ->setAdditionalInfoForData($contactEmails->getEmail())
                    ->save();
            }
        }
    }

    public function deleting(ContactEmails $contactEmails): void
    {
        /** @var Contact $contact */
        $contact = $contactEmails->contact;

        (new ActivityLogContact())
            ->setUserId($contact->getUserId())
            ->setActivityType(ActivityLogContact::DELETE_VALUE_FIELD_EVENT)
            ->setContactId($contact->getId())
            ->setModelName((new ReflectionClass($contactEmails))->getShortName())
            ->setModelField(self::FIELD_EMAIL)
            ->setDataOld($contactEmails->getOriginal(self::FIELD_EMAIL))
            ->setLogInfo($contactEmails->toJson())
            ->save();
    }
}